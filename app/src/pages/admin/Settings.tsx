import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Loader2,
  Save,
  Key,
  CheckCircle,
  XCircle,
  RefreshCw,
  Sparkles,
  BarChart3,
  Cpu,
} from 'lucide-react';
import { settingsAPI } from '@/services/api';

interface SettingItem {
  key: string;
  value: string;
  category: string;
  description: string;
  isEncrypted: boolean;
  lastUpdated: string | null;
  hasValue: boolean;
}

interface ApiStatus {
  configured: boolean;
  connected: boolean;
  message: string;
}

// Predefined OpenAI models
const OPENAI_MODELS = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast & Cost-effective' },
  { value: 'gpt-4', label: 'GPT-4', description: 'Most Capable' },
  { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo', description: 'Balanced' },
  { value: 'gpt-4o', label: 'GPT-4o', description: 'Latest Omni Model' },
  { value: 'custom', label: 'Custom Model...', description: 'Enter any model name' },
];

const Settings = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [originalSettings, setOriginalSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiStatus, setApiStatus] = useState<{
    ahrefs: ApiStatus;
    openai: ApiStatus;
    ready: boolean;
  } | null>(null);
  const [testingApi, setTestingApi] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<any>(null);
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [customModel, setCustomModel] = useState('');
  const [isCustomModel, setIsCustomModel] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsAPI.getAll();
      const settingsData: SettingItem[] = response.data.data;

      const settingsMap: Record<string, string> = {};
      settingsData.forEach((item) => {
        settingsMap[item.key] = item.value || '';
      });

      // Check if current model is custom
      const currentModel = settingsMap.OPENAI_MODEL || 'gpt-3.5-turbo';
      const isPredefined = OPENAI_MODELS.some(m => m.value === currentModel && m.value !== 'custom');
      if (!isPredefined && currentModel) {
        setIsCustomModel(true);
        setCustomModel(currentModel);
        settingsMap.OPENAI_MODEL = 'custom';
      }

      setSettings(settingsMap);
      setOriginalSettings({ ...settingsMap });
      setError('');
    } catch (err: any) {
      setError('Failed to load settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await settingsAPI.getStatus();
      setApiStatus(response.data.data);
    } catch (err) {
      console.error('Failed to fetch API status:', err);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleModelChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomModel(true);
      handleChange('OPENAI_MODEL', customModel || 'gpt-3.5-turbo');
    } else {
      setIsCustomModel(false);
      handleChange('OPENAI_MODEL', value);
    }
  };

  const handleCustomModelChange = (value: string) => {
    setCustomModel(value);
    if (isCustomModel) {
      handleChange('OPENAI_MODEL', value);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Prepare settings to save
      const settingsToSave = { ...settings };
      
      // If using custom model, ensure the actual model name is saved
      if (isCustomModel && customModel) {
        settingsToSave.OPENAI_MODEL = customModel;
      }

      // Only send settings that have changed
      const changedSettings = Object.entries(settingsToSave)
        .filter(([key, value]) => {
          // Don't include internal UI state
          if (key === 'custom') return false;
          return value !== originalSettings[key];
        })
        .map(([key, value]) => ({ key, value }));

      if (changedSettings.length === 0) {
        setSuccess('No changes to save');
        setSaving(false);
        return;
      }

      await settingsAPI.update({ settings: changedSettings });
      setSuccess('Settings saved successfully');
      setOriginalSettings({ ...settingsToSave });

      // Refresh status after saving
      await fetchStatus();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const testConnection = async (api: string) => {
    try {
      setTestingApi(api);
      const response = await settingsAPI.testConnection(api);

      if (response.data.success) {
        setSuccess(`${api.toUpperCase()} connection successful!`);
      } else {
        setError(
          `${api.toUpperCase()} connection failed: ${response.data.data.message}`
        );
      }

      // Refresh status
      await fetchStatus();
    } catch (err: any) {
      setError(
        `Failed to test ${api.toUpperCase()}: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setTestingApi(null);
    }
  };

  const fetchDebug = async () => {
    try {
      const response = await settingsAPI.getDebug();
      setDebugInfo(response.data.data);
      setShowDebug(true);
    } catch (err: any) {
      setError('Failed to fetch debug info');
    }
  };

  const runOpenAIDiagnostic = async () => {
    try {
      setRunningDiagnostic(true);
      setError('');
      const response = await settingsAPI.diagnoseOpenAI();
      setDiagnosticResult(response.data.data);
    } catch (err: any) {
      setError('Diagnostic failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunningDiagnostic(false);
    }
  };

  const runAhrefsDiagnostic = async () => {
    try {
      setRunningDiagnostic(true);
      setError('');
      const response = await settingsAPI.diagnoseAhrefs();
      setDiagnosticResult(response.data.data);
    } catch (err: any) {
      setError('Diagnostic failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setRunningDiagnostic(false);
    }
  };

  const hasChanges = Object.entries(settings).some(
    ([key, value]) => value !== originalSettings[key]
  ) || (isCustomModel && customModel !== originalSettings.OPENAI_MODEL);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500 mt-1">System configuration and preferences</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}

      {/* API Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            SEO API Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {apiStatus ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      apiStatus.ahrefs.connected
                        ? 'bg-green-500'
                        : apiStatus.ahrefs.configured
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <p className="font-medium">Ahrefs API</p>
                    <p className="text-sm text-gray-500">
                      {apiStatus.ahrefs.message}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection('ahrefs')}
                  disabled={testingApi === 'ahrefs'}
                >
                  {testingApi === 'ahrefs' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Test
                </Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${
                      apiStatus.openai.connected
                        ? 'bg-green-500'
                        : apiStatus.openai.configured
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <div>
                    <p className="font-medium">OpenAI API</p>
                    <p className="text-sm text-gray-500">
                      {apiStatus.openai.message}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testConnection('openai')}
                  disabled={testingApi === 'openai'}
                >
                  {testingApi === 'openai' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Test
                </Button>
              </div>

              <div
                className={`p-3 rounded-lg ${
                  apiStatus.ready
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-yellow-50 border border-yellow-200'
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    apiStatus.ready ? 'text-green-700' : 'text-yellow-700'
                  }`}
                >
                  {apiStatus.ready
                    ? '✓ All systems ready for keyword recommendations'
                    : '⚠ Configure both APIs to enable keyword recommendations'}
                </p>
              </div>

              <div className="pt-2 space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchDebug}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showDebug ? 'Hide' : 'Show'} Configuration Debug
                </Button>
                
                {showDebug && debugInfo && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs font-mono space-y-1">
                    <p className="font-semibold">OpenAI Configuration:</p>
                    <p>Configured: {debugInfo.openai.configured ? 'Yes' : 'No'}</p>
                    <p>Key Format: {debugInfo.openai.keyFormat}</p>
                    <p>Key Length: {debugInfo.openai.keyLength} chars</p>
                    <p>Base URL: {debugInfo.openai.baseUrl}</p>
                    <p>Model: {debugInfo.openai.model}</p>
                    <hr className="my-2" />
                    <p className="font-semibold">Ahrefs Configuration:</p>
                    <p>Configured: {debugInfo.ahrefs.configured ? 'Yes' : 'No'}</p>
                    <p>Key Length: {debugInfo.ahrefs.keyLength} chars</p>
                  </div>
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runOpenAIDiagnostic}
                    disabled={runningDiagnostic}
                  >
                    {runningDiagnostic ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Run OpenAI Diagnostic
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={runAhrefsDiagnostic}
                    disabled={runningDiagnostic}
                  >
                    {runningDiagnostic ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Run Ahrefs Diagnostic
                  </Button>
                </div>

                {diagnosticResult && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg text-xs font-mono space-y-2 max-h-96 overflow-y-auto">
                    <p className="font-semibold text-sm">Diagnostic Results:</p>
                    <pre className="whitespace-pre-wrap break-all">{JSON.stringify(diagnosticResult, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading status...</p>
          )}
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="AHREFS_API_KEY">Ahrefs API Key</Label>
            <Input
              id="AHREFS_API_KEY"
              type="password"
              value={settings.AHREFS_API_KEY || ''}
              onChange={(e) => handleChange('AHREFS_API_KEY', e.target.value)}
              placeholder="Enter your Ahrefs API key"
            />
            <p className="text-xs text-gray-500">
              Your Ahrefs API key for fetching real SEO metrics. Get it from your
              Ahrefs dashboard.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="OPENAI_API_KEY">OpenAI API Key</Label>
            <Input
              id="OPENAI_API_KEY"
              type="password"
              value={settings.OPENAI_API_KEY || ''}
              onChange={(e) => handleChange('OPENAI_API_KEY', e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            />
            <div className="text-xs text-gray-500 space-y-1">
              <p>Your OpenAI API key for AI-powered keyword extraction.</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Format: Should start with <code className="bg-gray-100 px-1 rounded">sk-</code></li>
                <li>Get it from: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">OpenAI Platform</a></li>
                <li>Ensure your account has billing enabled</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="OPENAI_BASE_URL">OpenAI Base URL</Label>
            <Input
              id="OPENAI_BASE_URL"
              type="text"
              value={settings.OPENAI_BASE_URL || 'https://api.openai.com/v1'}
              onChange={(e) => handleChange('OPENAI_BASE_URL', e.target.value)}
              placeholder="https://api.openai.com/v1"
            />
            <p className="text-xs text-gray-500">
              The base URL for OpenAI API. Default: https://api.openai.com/v1.
              Can be changed to use OpenAI-compatible APIs (e.g., Azure, LocalAI).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="OPENAI_MODEL" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              OpenAI Model
            </Label>
            <Select
              value={settings.OPENAI_MODEL || 'gpt-3.5-turbo'}
              onValueChange={handleModelChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {OPENAI_MODELS.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    <div className="flex flex-col">
                      <span>{model.label}</span>
                      <span className="text-xs text-gray-500">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {isCustomModel && (
              <div className="mt-2">
                <Input
                  type="text"
                  value={customModel}
                  onChange={(e) => handleCustomModelChange(e.target.value)}
                  placeholder="Enter custom model name (e.g., gpt-5, your-fine-tuned-model)"
                  className="text-sm"
                />
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-2">
              Select the AI model for keyword extraction. <strong>GPT-3.5 Turbo</strong> is recommended for cost-effectiveness.
              Future models (GPT-5, etc.) can be used by selecting "Custom Model".
            </p>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="SEO_DEFAULT_KEYWORD_COUNT">Default Keyword Count</Label>
            <Input
              id="SEO_DEFAULT_KEYWORD_COUNT"
              type="number"
              min="1"
              max="20"
              value={settings.SEO_DEFAULT_KEYWORD_COUNT || '10'}
              onChange={(e) =>
                handleChange('SEO_DEFAULT_KEYWORD_COUNT', e.target.value)
              }
            />
            <p className="text-xs text-gray-500">
              Number of keywords to recommend by default (1-20).
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="SEO_DEFAULT_COUNTRY">Default Country</Label>
            <Input
              id="SEO_DEFAULT_COUNTRY"
              type="text"
              value={settings.SEO_DEFAULT_COUNTRY || 'id'}
              onChange={(e) => handleChange('SEO_DEFAULT_COUNTRY', e.target.value)}
              placeholder="id"
            />
            <p className="text-xs text-gray-500">
              Country code for SEO analysis (e.g., id for Indonesia, us for USA).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="gap-2"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
