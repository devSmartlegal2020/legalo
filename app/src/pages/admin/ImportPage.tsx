import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  ChevronLeft,
  RotateCcw,
  Eye,
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload, ImportProgress } from '@/components/import';
import { importAPI } from '@/services/api';
import { toast } from 'sonner';

interface ImportProgressData {
  importId: string;
  status: 'processing' | 'completed' | 'failed' | 'cancelled';
  totalPosts: number;
  processedPosts: number;
  successCount: number;
  errorCount: number;
  currentOperation: string;
  currentPostTitle?: string;
  percentComplete: number;
  errors: Array<{
    postTitle: string;
    error: string;
    timestamp: Date;
  }>;
}

interface ImportPreview {
  posts: Array<{
    title: string;
    date: string;
    author: string;
    categories: string[];
    status: string;
  }>;
  totalPosts: number;
}

export const ImportPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [importId, setImportId] = useState<string | null>(null);
  const [progress, setProgress] = useState<ImportProgressData | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<'draft' | 'published'>('draft');
  const [activeTab, setActiveTab] = useState('upload');
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    console.log('File selected:', file.name, file.size, file.type);
    setSelectedFile(file);
    setPreview(null);
    setError(null);
    setIsLoading(true);

    try {
      console.log('Sending preview request...');
      const response = await importAPI.previewImport(file);
      console.log('Preview response:', response.data);
      
      if (response.data.success) {
        setPreview(response.data.data);
        toast.success(`Found ${response.data.data.totalPosts} posts in the export file`);
      } else {
        setError(response.data.message || 'Failed to preview import');
        toast.error(response.data.message || 'Failed to preview import');
      }
    } catch (err: any) {
      console.error('Preview error:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to preview import. Please check the file format.';
      setError(errorMessage);
      toast.error(errorMessage);
      // Don't clear selectedFile so user can see what went wrong
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle file clear
  const handleFileClear = useCallback(() => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  }, []);

  // Start import
  const handleStartImport = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const response = await importAPI.startImport(selectedFile, defaultStatus);
      if (response.data.success) {
        setImportId(response.data.data.importId);
        setActiveTab('progress');
        toast.success('Import started successfully');
      } else {
        toast.error('Failed to start import');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start import');
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel import
  const handleCancelImport = async () => {
    if (!importId) return;

    try {
      await importAPI.cancelImport(importId);
      toast.info('Import cancelled');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel import');
    }
  };

  // Stream progress
  useEffect(() => {
    if (!importId) return;

    let cleanup: (() => void) | null = null;

    const startStreaming = () => {
      cleanup = importAPI.streamProgress(
        importId,
        (data) => {
          setProgress(data);
        },
        (error) => {
          console.error('SSE error:', error);
          toast.error('Connection lost. Retrying...');
          // Retry connection after 3 seconds
          setTimeout(startStreaming, 3000);
        }
      );
    };

    startStreaming();

    return () => {
      if (cleanup) cleanup();
    };
  }, [importId]);

  // Handle import completion
  useEffect(() => {
    if (progress?.status === 'completed') {
      toast.success(`Import completed! ${progress.successCount} posts imported successfully.`);
    } else if (progress?.status === 'failed') {
      toast.error('Import failed. Check the error log for details.');
    } else if (progress?.status === 'cancelled') {
      toast.info('Import was cancelled.');
    }
  }, [progress?.status]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary"><XCircle className="h-3 w-3 mr-1" /> Cancelled</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1 animate-pulse" /> Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import WordPress Posts</h1>
          <p className="text-gray-600 mt-1">
            Import blog posts from your WordPress XML export file
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="upload">Upload & Preview</TabsTrigger>
          <TabsTrigger value="progress" disabled={!importId}>
            Import Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          {/* File Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload WordPress Export
              </CardTitle>
              <CardDescription>
                Select your WordPress XML export file (WXR format)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                onFileClear={handleFileClear}
                selectedFile={selectedFile}
                disabled={isLoading}
              />

              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <RotateCcw className="h-5 w-5 mr-2 animate-spin" />
                  <span>Analyzing file...</span>
                </div>
              )}

              {selectedFile && preview && (
                <>
                  <Separator />
                  
                  {/* Import Options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Import Options</h3>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="default-status" className="font-medium">
                          Default Post Status
                        </Label>
                        <p className="text-sm text-gray-500">
                          Set the status for imported posts
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {defaultStatus === 'draft' ? 'Draft' : 'Published'}
                        </span>
                        <Switch
                          id="default-status"
                          checked={defaultStatus === 'published'}
                          onCheckedChange={(checked) => 
                            setDefaultStatus(checked ? 'published' : 'draft')
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Preview Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Preview</h3>
                      <Badge variant="secondary">
                        {preview.totalPosts} total posts
                      </Badge>
                    </div>

                    <Alert>
                      <Eye className="h-4 w-4" />
                      <AlertDescription>
                        Showing first {preview.posts.length} posts from the export
                      </AlertDescription>
                    </Alert>

                    <div className="space-y-3">
                      {preview.posts.map((post, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 truncate">
                                {post.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                <span>•</span>
                                <span>{post.author}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {post.categories.map((cat, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Warnings */}
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800">
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Categories will be created if they don't exist</li>
                          <li>Authors will be matched to existing users when possible</li>
                          <li>Duplicate slugs will be automatically renamed</li>
                          <li>Images will be downloaded and stored locally</li>
                        </ul>
                      </AlertDescription>
                    </Alert>

                    {/* Start Import Button */}
                    <Button
                      onClick={handleStartImport}
                      disabled={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <>
                          <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                          Starting Import...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Start Import ({preview.totalPosts} posts)
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {progress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Import Progress
                  </span>
                  {getStatusBadge(progress.status)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImportProgress
                  progress={progress}
                  onCancel={progress.status === 'processing' ? handleCancelImport : undefined}
                />
              </CardContent>
            </Card>
          )}

          {/* Actions after completion */}
          {progress && ['completed', 'failed', 'cancelled'].includes(progress.status) && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Import {progress.status}</h3>
                    <p className="text-sm text-gray-500">
                      {progress.status === 'completed' 
                        ? 'Your posts have been imported successfully.'
                        : progress.status === 'failed'
                        ? 'There were errors during the import process.'
                        : 'The import was cancelled.'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    {progress.status === 'completed' && (
                      <Button onClick={() => navigate('/admin/blogs')}>
                        View Imported Posts
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => {
                      setImportId(null);
                      setProgress(null);
                      setSelectedFile(null);
                      setPreview(null);
                      setError(null);
                      setActiveTab('upload');
                    }}>
                      Import Another File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImportPage;
