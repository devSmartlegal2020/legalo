import { Response } from 'express';
import { validationResult } from 'express-validator';
import { AuthRequest } from '../types';
import { Setting } from '../models';
import { testAhrefsConnection } from '../services/ahrefsService';
import { testOpenAIConnection } from '../services/openaiService';

// Default settings configuration
const DEFAULT_SETTINGS = [
  {
    key: 'AHREFS_API_KEY',
    category: 'api',
    description: 'Ahrefs API key for keyword research and SEO metrics',
    isEncrypted: true,
  },
  {
    key: 'OPENAI_API_KEY',
    category: 'api',
    description: 'OpenAI API key for AI-powered keyword extraction',
    isEncrypted: true,
  },
  {
    key: 'OPENAI_BASE_URL',
    category: 'api',
    description: 'OpenAI API base URL (default: https://api.openai.com/v1)',
    isEncrypted: false,
    defaultValue: 'https://api.openai.com/v1',
  },
  {
    key: 'OPENAI_MODEL',
    category: 'api',
    description: 'OpenAI model to use for keyword extraction',
    isEncrypted: false,
    defaultValue: 'gpt-3.5-turbo',
  },
  {
    key: 'SEO_DEFAULT_KEYWORD_COUNT',
    category: 'seo',
    description: 'Default number of keywords to recommend',
    isEncrypted: false,
    defaultValue: '10',
  },
  {
    key: 'SEO_DEFAULT_COUNTRY',
    category: 'seo',
    description: 'Default country code for SEO analysis (e.g., id for Indonesia)',
    isEncrypted: false,
    defaultValue: 'id',
  },
];

/**
 * Get all settings
 * Returns settings with masked values for sensitive data
 */
export const getSettings = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const settings = await Setting.find().sort({ category: 1, key: 1 });

    const formattedSettings = settings.map((setting) => {
      const isEncrypted = setting.isEncrypted;
      let value = setting.value;

      // Mask encrypted values
      if (isEncrypted && value) {
        const decrypted = setting.getDecryptedValue();
        if (decrypted.length > 8) {
          value = decrypted.substring(0, 4) + '****' + decrypted.substring(decrypted.length - 4);
        } else {
          value = '****';
        }
      }

      return {
        key: setting.key,
        value,
        category: setting.category,
        description: setting.description,
        isEncrypted,
        lastUpdated: setting.lastUpdated,
        hasValue: !!setting.value && setting.value !== '',
      };
    });

    // Add default settings that don't exist yet
    const existingKeys = settings.map((s) => s.key);
    const missingDefaults = DEFAULT_SETTINGS.filter(
      (d) => !existingKeys.includes(d.key)
    );

    const defaultSettingsFormatted = missingDefaults.map((d) => ({
      key: d.key,
      value: d.defaultValue || '',
      category: d.category,
      description: d.description,
      isEncrypted: d.isEncrypted,
      lastUpdated: null,
      hasValue: false,
    }));

    res.json({
      success: true,
      data: [...formattedSettings, ...defaultSettingsFormatted],
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings',
    });
  }
};

/**
 * Update settings
 */
export const updateSettings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
      return;
    }

    const { settings } = req.body;

    if (!settings || !Array.isArray(settings)) {
      res.status(400).json({
        success: false,
        message: 'Settings array is required',
      });
      return;
    }

    const updatedSettings = [];

    for (const item of settings) {
      const { key, value } = item;

      if (!key) continue;

      const defaultConfig = DEFAULT_SETTINGS.find((d) => d.key === key);
      const isEncrypted = defaultConfig?.isEncrypted || false;

      const setting = await Setting.setValue(
        key,
        value || '',
        isEncrypted,
        req.user?._id
      );

      updatedSettings.push(setting);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: updatedSettings.length,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update settings',
    });
  }
};

/**
 * Get SEO API configuration status
 */
export const getStatus = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ahrefsKey = await Setting.getValue('AHREFS_API_KEY');
    const openaiKey = await Setting.getValue('OPENAI_API_KEY');

    const status = {
      ahrefs: {
        configured: !!ahrefsKey,
        connected: false,
        message: ahrefsKey ? 'Testing connection...' : 'Not configured',
      },
      openai: {
        configured: !!openaiKey,
        connected: false,
        message: openaiKey ? 'Testing connection...' : 'Not configured',
      },
      ready: !!ahrefsKey && !!openaiKey,
    };

    // Test connections if configured
    if (ahrefsKey) {
      try {
        const ahrefsTest = await testAhrefsConnection();
        status.ahrefs.connected = ahrefsTest.success;
        status.ahrefs.message = ahrefsTest.message;
      } catch (error: any) {
        status.ahrefs.message = error.message;
      }
    }

    if (openaiKey) {
      try {
        const openaiTest = await testOpenAIConnection();
        status.openai.connected = openaiTest.success;
        status.openai.message = openaiTest.message;
      } catch (error: any) {
        status.openai.message = error.message;
      }
    }

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    console.error('Get status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check API status',
    });
  }
};

/**
 * Test individual API connection
 */
export const testConnection = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { api } = req.params;

    if (api === 'ahrefs') {
      const result = await testAhrefsConnection();
      res.json({
        success: result.success,
        data: result,
      });
      return;
    }

    if (api === 'openai') {
      const result = await testOpenAIConnection();
      res.json({
        success: result.success,
        data: result,
      });
      return;
    }

    res.status(400).json({
      success: false,
      message: 'Invalid API name. Use "ahrefs" or "openai"',
    });
  } catch (error: any) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to test connection',
    });
  }
};
