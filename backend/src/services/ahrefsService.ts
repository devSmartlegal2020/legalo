import axios from 'axios';
import { Setting } from '../models';

const getAhrefsBaseUrl = (): string => {
  return process.env.AHREFS_BASE_URL || 'https://api.ahrefs.com/v3';
};

const getAhrefsApiKey = async (): Promise<string | null> => {
  const apiKey = await Setting.getValue('AHREFS_API_KEY');
  return apiKey || process.env.AHREFS_API_KEY || null;
};

export interface AhrefsKeywordMetric {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  trafficPotential: number;
}

/**
 * Get keyword metrics from Ahrefs API
 * Uses GET request with query parameters (per Ahrefs API v3 documentation)
 */
export const getKeywordMetrics = async (
  keywords: string[],
  country: string = 'id'
): Promise<AhrefsKeywordMetric[]> => {
  const apiKey = await getAhrefsApiKey();
  const baseUrl = getAhrefsBaseUrl();

  if (!apiKey) {
    throw new Error('AHREFS_API_KEY is not configured in Settings');
  }

  if (keywords.length === 0) {
    return [];
  }

  try {
    // Ahrefs API v3 uses GET with query parameters and Bearer token in header
    const params = new URLSearchParams({
      keywords: keywords.join(','),
      select: 'volume,difficulty,cpc,traffic_potential',
      country: country,
    });

    const response = await axios.get(
      `${baseUrl}/keywords-explorer/overview?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        timeout: 30000,
      }
    );

    const metrics: AhrefsKeywordMetric[] = [];

    if (response.data && Array.isArray(response.data.keywords)) {
      response.data.keywords.forEach((item: any) => {
        metrics.push({
          keyword: item.keyword || '',
          volume: item.volume || 0,
          difficulty: item.difficulty || 0,
          cpc: item.cpc || 0,
          trafficPotential: item.traffic_potential || 0,
        });
      });
    }

    return metrics;
  } catch (error: any) {
    console.error('Ahrefs API error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: `${baseUrl}/keywords-explorer/overview`,
    });

    // Check for specific error types
    if (error.response?.status === 429) {
      throw new Error('Ahrefs rate limit exceeded. Please try again later.');
    }

    if (error.response?.status === 401) {
      throw new Error('Invalid Ahrefs API key. Please check your configuration.');
    }

    if (error.response?.status === 403) {
      throw new Error('Access Forbidden: Your API key does not have permission for the Keywords Explorer API. Please check your Ahrefs subscription plan.');
    }

    throw new Error(
      error.response?.data?.error || error.response?.data?.message || error.message || 'Failed to fetch keyword metrics from Ahrefs'
    );
  }
};

/**
 * Test Ahrefs API connection
 * Uses GET request with Bearer token (correct method per Ahrefs API v3)
 */
export const testAhrefsConnection = async (): Promise<{ success: boolean; message: string; details?: any }> => {
  const apiKey = await getAhrefsApiKey();
  const baseUrl = getAhrefsBaseUrl();

  if (!apiKey) {
    return { success: false, message: 'AHREFS_API_KEY not configured in Settings' };
  }

  try {
    // Use GET with query parameters and Bearer token
    const params = new URLSearchParams({
      keywords: 'test',
      select: 'volume',
      country: 'id',
    });

    const response = await axios.get(
      `${baseUrl}/keywords-explorer/overview?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json',
        },
        timeout: 10000,
        validateStatus: () => true // Don't throw on error status
      }
    );

    if (response.status === 200) {
      return { 
        success: true, 
        message: 'Connected successfully',
        details: { status: response.status, statusText: response.statusText }
      };
    }

    // Log error details
    console.error('Ahrefs connection test failed:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });

    if (response.status === 403) {
      return {
        success: false,
        message: 'Access Forbidden (403): Your API key does not have permission for the Keywords Explorer API. Please check your Ahrefs subscription plan.',
        details: { status: response.status, data: response.data }
      };
    }

    if (response.status === 401) {
      return {
        success: false,
        message: 'Unauthorized (401): Invalid API key. Please verify your API key.',
        details: { status: response.status, data: response.data }
      };
    }

    return {
      success: false,
      message: `HTTP ${response.status}: ${response.statusText}`,
      details: { status: response.status, data: response.data }
    };

  } catch (error: any) {
    console.error('Ahrefs connection test error:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
      } : null,
    });

    return {
      success: false,
      message: error.response?.data?.error || error.response?.data?.message || error.message || 'Network error',
      details: error.response ? { status: error.response.status, data: error.response.data } : null
    };
  }
};
