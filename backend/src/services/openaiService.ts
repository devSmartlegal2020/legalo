import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Setting } from '../models';

/**
 * Get OpenAI configuration from settings
 */
const getOpenAIConfig = async (): Promise<{
  apiKey: string | null;
  baseUrl: string;
  model: string;
}> => {
  const [apiKey, baseUrl, model] = await Promise.all([
    Setting.getValue('OPENAI_API_KEY'),
    Setting.getValue('OPENAI_BASE_URL'),
    Setting.getValue('OPENAI_MODEL'),
  ]);

  return {
    apiKey: apiKey || null,
    baseUrl: baseUrl || process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    model: model || process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
  };
};

/**
 * Extract plain text from HTML content
 */
const extractPlainText = (html: string): string => {
  const dom = new JSDOM(html);
  return dom.window.document.body.textContent || '';
};

/**
 * Call OpenAI API to extract keywords from content
 */
export const extractKeywordsWithOpenAI = async (
  title: string,
  content: string,
  maxKeywords: number = 10
): Promise<string[]> => {
  const { apiKey, baseUrl, model } = await getOpenAIConfig();

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured in Settings');
  }

  const plainText = extractPlainText(content);
  const combinedText = `Title: ${title}\n\nContent: ${plainText.substring(0, 3000)}`;

  const prompt = `You are an SEO keyword research expert specializing in Indonesian legal content.

Analyze the following blog post and extract ${maxKeywords} relevant SEO keywords that would be valuable for search engine optimization.

Requirements:
1. Focus on keywords relevant to Indonesian law and legal services
2. Include a mix of short-tail and long-tail keywords
3. Consider search intent (informational, transactional, navigational)
4. Prioritize keywords with commercial value for a law firm
5. Include Indonesian language keywords where appropriate

Return ONLY a JSON array of keywords, nothing else.
Example: ["pengacara jakarta", "hukum perceraian", "pendirian pt", "konsultasi hukum online"]

Blog post to analyze:
${combinedText}`;

  try {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model: model,
        messages: [
          {
            role: 'system',
            content:
              'You are an SEO keyword research expert. Always return valid JSON arrays only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    const responseContent = response.data.choices[0]?.message?.content || '';

    // Extract JSON array from response
    const jsonMatch = responseContent.match(/\[[\s\S]*?\]/);
    if (jsonMatch) {
      const keywords: string[] = JSON.parse(jsonMatch[0]);
      return keywords
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k.length > 0)
        .slice(0, maxKeywords);
    }

    // Fallback: split by commas or newlines
    return responseContent
      .split(/[,\n]/)
      .map((k: string) => k.trim().replace(/^["\']|["\']$/g, '').toLowerCase())
      .filter((k: string) => k.length > 0 && !k.includes('keywords:'))
      .slice(0, maxKeywords);
  } catch (error: any) {
    console.error('OpenAI API error:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      model: model,
    });

    if (error.response?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    }

    if (error.response?.status === 429) {
      throw new Error('OpenAI rate limit exceeded. Please try again later.');
    }

    if (error.response?.data?.error?.code === 'model_not_found') {
      throw new Error(`Model "${model}" not found. Please check your model name in Settings.`);
    }

    throw new Error(
      error.response?.data?.error?.message || 'Failed to extract keywords with OpenAI'
    );
  }
};

/**
 * Test OpenAI API connection
 */
export const testOpenAIConnection = async (): Promise<{
  success: boolean;
  message: string;
  model?: string;
}> => {
  const { apiKey, baseUrl, model } = await getOpenAIConfig();

  if (!apiKey) {
    return { success: false, message: 'OPENAI_API_KEY not configured in Settings' };
  }

  // Validate API key format (OpenAI keys typically start with 'sk-')
  if (!apiKey.startsWith('sk-')) {
    return {
      success: false,
      message: 'Invalid API key format. OpenAI keys should start with "sk-"',
    };
  }

  try {
    const response = await axios.post(
      `${baseUrl}/chat/completions`,
      {
        model: model,
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: `Connected successfully (model: ${model})`,
        model: model,
      };
    }

    return {
      success: false,
      message: `Unexpected response: HTTP ${response.status}`,
    };
  } catch (error: any) {
    const errorData = error.response?.data;
    const errorMessage = errorData?.error?.message || error.message;
    const errorCode = errorData?.error?.code;

    console.error('OpenAI connection test failed:', {
      status: error.response?.status,
      code: errorCode,
      message: errorMessage,
    });

    if (error.response?.status === 401) {
      return {
        success: false,
        message: `Authentication failed: ${errorMessage}. Please check your API key.`,
      };
    }

    if (errorCode === 'model_not_found') {
      return {
        success: false,
        message: `Model "${model}" not found. Please select a valid model in Settings.`,
      };
    }

    if (error.response?.status === 429) {
      return {
        success: false,
        message: `Rate limit exceeded: ${errorMessage}`,
      };
    }

    return {
      success: false,
      message: `${errorMessage} (HTTP ${error.response?.status || 'unknown'})`,
    };
  }
};
