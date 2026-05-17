import { Router } from 'express';
import { body } from 'express-validator';
import {
  getSettings,
  updateSettings,
  getStatus,
  testConnection,
} from '../controllers/settingsController';
import { authenticate, authorize } from '../middleware/auth';
import { Setting } from '../models';
import axios from 'axios';

const router = Router();

// All settings routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

// Get all settings
router.get('/', getSettings);

// Update settings
router.put(
  '/',
  [
    body('settings').isArray().withMessage('Settings must be an array'),
    body('settings.*.key').notEmpty().withMessage('Setting key is required'),
  ],
  updateSettings
);

// Get API status
router.get('/status', getStatus);

// Test individual API connection
router.get('/test/:api', testConnection);

// Debug endpoint to check configuration (without exposing keys)
router.get('/debug', async (req, res) => {
  try {
    const openaiKey = await Setting.getValue('OPENAI_API_KEY');
    const openaiBaseUrl = await Setting.getValue('OPENAI_BASE_URL');
    const openaiModel = await Setting.getValue('OPENAI_MODEL');
    const ahrefsKey = await Setting.getValue('AHREFS_API_KEY');

    res.json({
      success: true,
      data: {
        openai: {
          configured: !!openaiKey,
          keyFormat: openaiKey ? (openaiKey.startsWith('sk-') ? 'valid' : 'invalid - should start with sk-') : 'not set',
          keyLength: openaiKey ? openaiKey.length : 0,
          baseUrl: openaiBaseUrl || 'https://api.openai.com/v1 (default)',
          model: openaiModel || 'gpt-3.5-turbo (default)',
        },
        ahrefs: {
          configured: !!ahrefsKey,
          keyLength: ahrefsKey ? ahrefsKey.length : 0,
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Debug check failed' });
  }
});

// Detailed OpenAI diagnostic endpoint
router.get('/diagnose/openai', async (req, res) => {
  try {
    const apiKey = await Setting.getValue('OPENAI_API_KEY');
    const baseUrl = await Setting.getValue('OPENAI_BASE_URL') || 'https://api.openai.com/v1';
    const model = await Setting.getValue('OPENAI_MODEL') || 'gpt-3.5-turbo';
    
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      configuration: {
        configured: !!apiKey,
        baseUrl: baseUrl,
        model: model,
        keyLength: apiKey ? apiKey.length : 0,
        keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'not set',
        startsWithSk: apiKey ? apiKey.startsWith('sk-') : false,
      },
      tests: []
    };

    if (!apiKey) {
      diagnostics.tests.push({
        step: 'Configuration Check',
        status: 'FAILED',
        message: 'API key not configured'
      });
      return res.json({ success: false, data: diagnostics });
    }

    // Test 1: Basic connection with minimal request
    try {
      diagnostics.tests.push({
        step: 'Test 1: Basic Connection',
        status: 'RUNNING',
        details: {
          url: `${baseUrl}/chat/completions`,
          model: model,
          headers: {
            'Authorization': 'Bearer sk-****' + (apiKey.length > 8 ? apiKey.slice(-4) : ''),
            'Content-Type': 'application/json'
          }
        }
      });

      const response = await axios.post(
        `${baseUrl}/chat/completions`,
        {
          model: model,
          messages: [{ role: 'user', content: 'Hello' }],
          max_tokens: 5,
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
          validateStatus: () => true // Don't throw on error status
        }
      );

      diagnostics.tests[0].status = response.status === 200 ? 'PASSED' : 'FAILED';
      diagnostics.tests[0].httpStatus = response.status;
      diagnostics.tests[0].response = {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };

      if (response.status === 200) {
        return res.json({ success: true, data: diagnostics });
      }

    } catch (error: any) {
      diagnostics.tests[0].status = 'ERROR';
      diagnostics.tests[0].error = {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        } : null
      };
    }

    // Provide troubleshooting suggestions
    diagnostics.suggestions = [];
    
    if (!apiKey.startsWith('sk-')) {
      diagnostics.suggestions.push('Your API key does not start with "sk-". OpenAI API keys should start with "sk-".');
    }
    
    if (apiKey.length < 20) {
      diagnostics.suggestions.push('Your API key seems too short. API keys are typically 40+ characters.');
    }

    diagnostics.suggestions.push('1. Verify you copied the entire API key from https://platform.openai.com/api-keys');
    diagnostics.suggestions.push('2. Make sure you are using an API key, not a session token or other credential');
    diagnostics.suggestions.push('3. Check if your API key has been revoked in the OpenAI dashboard');
    diagnostics.suggestions.push('4. Ensure your OpenAI account has billing enabled and available credits');
    diagnostics.suggestions.push('5. Verify the model name is correct (e.g., gpt-3.5-turbo, gpt-4)');
    diagnostics.suggestions.push('6. Try regenerating a new API key if the current one is not working');

    res.json({ success: false, data: diagnostics });

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Diagnostic failed',
      error: error.message 
    });
  }
});

// Detailed Ahrefs diagnostic endpoint
router.get('/diagnose/ahrefs', async (req, res) => {
  try {
    const apiKey = await Setting.getValue('AHREFS_API_KEY');
    const baseUrl = (await Setting.getValue('AHREFS_BASE_URL')) || 'https://api.ahrefs.com/v3';
    
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      configuration: {
        configured: !!apiKey,
        baseUrl: baseUrl,
        keyLength: apiKey ? apiKey.length : 0,
        keyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'not set',
      },
      tests: [],
      troubleshooting: []
    };

    if (!apiKey) {
      diagnostics.tests.push({
        step: 'Configuration Check',
        status: 'FAILED',
        message: 'API key not configured'
      });
      diagnostics.troubleshooting.push('1. Enter your Ahrefs API key in Settings');
      return res.json({ success: false, data: diagnostics });
    }

    // Test with GET request (correct method per Ahrefs API v3)
    try {
      diagnostics.tests.push({
        step: 'Testing: GET with Bearer Token',
        status: 'RUNNING',
        details: {
          url: `${baseUrl}/keywords-explorer/overview?keywords=test&select=volume&country=id`,
          method: 'GET',
          headers: ['Authorization', 'Accept']
        }
      });

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
          validateStatus: () => true
        }
      );

      const testIndex = diagnostics.tests.length - 1;
      diagnostics.tests[testIndex].status = response.status === 200 ? 'PASSED' : 'FAILED';
      diagnostics.tests[testIndex].httpStatus = response.status;
      diagnostics.tests[testIndex].response = {
        status: response.status,
        statusText: response.statusText,
        data: response.data
      };

      if (response.status === 200) {
        diagnostics.troubleshooting.push('✓ Connection successful!');
      } else if (response.status === 403) {
        diagnostics.tests[testIndex].error = 'Access Forbidden - API key lacks permission';
      }

    } catch (error: any) {
      const testIndex = diagnostics.tests.length - 1;
      diagnostics.tests[testIndex].status = 'ERROR';
      diagnostics.tests[testIndex].error = error.message;
    }

    // Add troubleshooting suggestions
    const has403 = diagnostics.tests.some((t: any) => t.httpStatus === 403);
    const has401 = diagnostics.tests.some((t: any) => t.httpStatus === 401);

    if (has403) {
      diagnostics.troubleshooting.push('🔴 403 Forbidden: Your API key does not have access to the Keywords Explorer API');
      diagnostics.troubleshooting.push('   - Check your Ahrefs subscription plan (API access may require higher tier)');
      diagnostics.troubleshooting.push('   - Verify the API key has "Keywords Explorer" permissions');
      diagnostics.troubleshooting.push('   - Contact Ahrefs support if you believe this is an error');
    }

    if (has401) {
      diagnostics.troubleshooting.push('🔴 401 Unauthorized: Invalid API key');
      diagnostics.troubleshooting.push('   - Verify you copied the complete API key');
      diagnostics.troubleshooting.push('   - Check if the API key has been revoked');
    }

    if (!has403 && !has401) {
      diagnostics.troubleshooting.push('🟡 Check the test results above for specific error details');
    }

    diagnostics.troubleshooting.push('');
    diagnostics.troubleshooting.push('Additional resources:');
    diagnostics.troubleshooting.push('- Ahrefs API Docs: https://ahrefs.com/api');
    diagnostics.troubleshooting.push('- Get API Key: https://ahrefs.com/dashboard/settings/api');

    const allFailed = diagnostics.tests.every((t: any) => t.status !== 'PASSED');
    res.json({ success: !allFailed, data: diagnostics });

  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      message: 'Diagnostic failed',
      error: error.message 
    });
  }
});

export default router;
