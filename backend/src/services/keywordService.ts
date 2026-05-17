import crypto from 'crypto';
import { extractKeywordsWithOpenAI } from './openaiService';
import { getKeywordMetrics, AhrefsKeywordMetric } from './ahrefsService';
import { KeywordCache } from '../models';

export interface KeywordRecommendation {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trafficPotential: number;
  relevance: number;
  isEstimated: boolean;
}

/**
 * Generate a hash of the content for caching
 */
const generateContentHash = (title: string, content: string): string => {
  return crypto
    .createHash('md5')
    .update(title + '|' + content)
    .digest('hex');
};

/**
 * Check if cached results exist and are valid
 */
const getCachedResults = async (
  contentHash: string
): Promise<KeywordRecommendation[] | null> => {
  try {
    const cache = await KeywordCache.findOne({ contentHash });
    if (cache && cache.expiresAt > new Date()) {
      return cache.keywords.map((k) => ({
        keyword: k.keyword,
        volume: k.volume,
        difficulty: k.difficulty,
        cpc: k.cpc,
        trafficPotential: k.trafficPotential,
        relevance: k.relevance,
        isEstimated: false,
      }));
    }
  } catch (error) {
    console.error('Cache read error:', error);
  }
  return null;
};

/**
 * Save results to cache
 */
const cacheResults = async (
  contentHash: string,
  title: string,
  keywords: KeywordRecommendation[]
): Promise<void> => {
  try {
    await KeywordCache.findOneAndUpdate(
      { contentHash },
      {
        contentHash,
        title,
        keywords: keywords.map((k) => ({
          keyword: k.keyword,
          volume: k.volume,
          difficulty: k.difficulty,
          cpc: k.cpc,
          trafficPotential: k.trafficPotential,
          relevance: k.relevance,
        })),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Cache write error:', error);
  }
};

/**
 * Calculate relevance score based on keyword appearance in title and content
 */
const calculateRelevance = (
  keyword: string,
  title: string,
  content: string
): number => {
  const keywordLower = keyword.toLowerCase();
  const titleLower = title.toLowerCase();
  const contentLower = content.toLowerCase();

  let score = 5; // Base score

  // Title match is highly relevant
  if (titleLower.includes(keywordLower)) {
    score += 3;
  }

  // Content frequency
  const contentMatches = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length;
  if (contentMatches > 0) {
    score += Math.min(contentMatches, 2); // Cap at +2 for frequency
  }

  // Word count preference (long-tail keywords are often more relevant)
  const wordCount = keyword.split(/\s+/).length;
  if (wordCount >= 2 && wordCount <= 4) {
    score += 1;
  }

  return Math.min(score, 10); // Cap at 10
};

/**
 * Generate keyword recommendations by combining OpenAI and Ahrefs
 */
export const generateRecommendations = async (
  title: string,
  content: string,
  country: string = 'id',
  maxKeywords: number = 10
): Promise<KeywordRecommendation[]> => {
  // Validate content length
  const plainText = content.replace(/<[^\u003e]*>/g, '').trim();
  if (plainText.length < 100) {
    throw new Error('Content must be at least 100 characters long');
  }

  const contentHash = generateContentHash(title, content);

  // Check cache first
  const cached = await getCachedResults(contentHash);
  if (cached) {
    console.log('Returning cached keyword recommendations');
    return cached;
  }

  // Step 1: Extract keywords with OpenAI
  let openaiKeywords: string[];
  try {
    openaiKeywords = await extractKeywordsWithOpenAI(title, content, maxKeywords + 5); // Get extra for filtering
    console.log('OpenAI extracted keywords:', openaiKeywords);
  } catch (error: any) {
    console.error('OpenAI extraction failed:', error);
    throw new Error(`Failed to analyze content with AI: ${error.message}`);
  }

  if (openaiKeywords.length === 0) {
    throw new Error('No keywords could be extracted from the content');
  }

  // Step 2: Get metrics from Ahrefs
  let ahrefsMetrics: AhrefsKeywordMetric[] = [];

  try {
    ahrefsMetrics = await getKeywordMetrics(openaiKeywords, country);
    console.log('Ahrefs returned metrics for', ahrefsMetrics.length, 'keywords');
    console.log('Ahrefs metrics:', ahrefsMetrics.map(m => ({ keyword: m.keyword, volume: m.volume })));
  } catch (error: any) {
    console.error('Ahrefs API failed:', error.message);
  }

  // Step 3: Merge and create recommendations
  const recommendations: KeywordRecommendation[] = [];

  for (const keyword of openaiKeywords) {
    const ahrefsData = ahrefsMetrics.find(
      (m) => m.keyword.toLowerCase() === keyword.toLowerCase()
    );

    const relevance = calculateRelevance(keyword, title, content);

    if (ahrefsData && ahrefsData.volume > 0) {
      // Use real Ahrefs data only if volume > 0 (valid data)
      recommendations.push({
        keyword: keyword,
        volume: ahrefsData.volume,
        difficulty: ahrefsData.difficulty,
        cpc: ahrefsData.cpc,
        trafficPotential: ahrefsData.trafficPotential,
        relevance,
        isEstimated: false,
      });
    } else {
      // Use estimated metrics when Ahrefs has no data or returns zeros
      const estimatedVolume = estimateVolume(keyword);
      recommendations.push({
        keyword: keyword,
        volume: estimatedVolume,
        difficulty: estimateDifficulty(keyword),
        cpc: estimateCPC(keyword),
        trafficPotential: estimateTrafficPotential(keyword),
        relevance,
        isEstimated: true,
      });
      
      if (ahrefsData) {
        console.log(`Ahrefs returned 0 volume for "${keyword}", using estimated volume: ${estimatedVolume}`);
      }
    }
  }

  // Sort by relevance (descending), then by volume (descending)
  recommendations.sort((a, b) => {
    if (b.relevance !== a.relevance) {
      return b.relevance - a.relevance;
    }
    return b.volume - a.volume;
  });

  // Take top keywords
  const finalRecommendations = recommendations.slice(0, maxKeywords);
  
  console.log('Final recommendations:', finalRecommendations.map(k => ({ 
    keyword: k.keyword, 
    volume: k.volume, 
    isEstimated: k.isEstimated 
  })));

  // Cache results
  await cacheResults(contentHash, title, finalRecommendations);

  return finalRecommendations;
};

/**
 * Estimate search volume based on keyword characteristics
 * These are rough estimates for fallback when Ahrefs is unavailable
 */
const estimateVolume = (keyword: string): number => {
  const wordCount = keyword.split(/\s+/).length;
  const baseVolume = Math.floor(Math.random() * 5000) + 100;

  // Long-tail keywords typically have lower volume
  if (wordCount >= 4) {
    return Math.floor(baseVolume * 0.3);
  } else if (wordCount >= 2) {
    return Math.floor(baseVolume * 0.7);
  }

  return baseVolume;
};

/**
 * Estimate keyword difficulty based on keyword characteristics
 */
const estimateDifficulty = (keyword: string): number => {
  const wordCount = keyword.split(/\s+/).length;

  // Short-tail keywords are usually harder
  if (wordCount === 1) {
    return Math.floor(Math.random() * 30) + 60; // 60-90
  } else if (wordCount >= 4) {
    return Math.floor(Math.random() * 40) + 10; // 10-50
  }

  return Math.floor(Math.random() * 40) + 30; // 30-70
};

/**
 * Estimate CPC based on keyword characteristics
 */
const estimateCPC = (keyword: string): number => {
  const commercialTerms = [
    'pengacara',
    'lawyer',
    'konsultasi',
    'jasa',
    'biaya',
    'harga',
    'fee',
    'service',
  ];

  const hasCommercialTerm = commercialTerms.some(
    (term) => keyword.toLowerCase().includes(term)
  );

  if (hasCommercialTerm) {
    return parseFloat((Math.random() * 5 + 2).toFixed(2)); // $2-7
  }

  return parseFloat((Math.random() * 2 + 0.5).toFixed(2)); // $0.5-2.5
};

/**
 * Estimate traffic potential
 */
const estimateTrafficPotential = (keyword: string): number => {
  const volume = estimateVolume(keyword);
  // If ranked #1, typically get ~30% of search volume
  return Math.floor(volume * 0.3);
};
