import React from 'react';
import { Loader2, CheckCircle, AlertCircle, XCircle, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ImportError {
  postTitle: string;
  error: string;
  timestamp: Date;
}

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
  errors: ImportError[];
}

interface ImportProgressProps {
  progress: ImportProgressData;
  onCancel?: () => void;
  showErrors?: boolean;
  className?: string;
}

export const ImportProgress: React.FC<ImportProgressProps> = ({
  progress,
  onCancel,
  showErrors = true,
  className,
}) => {
  const isActive = progress.status === 'processing';
  const isCompleted = progress.status === 'completed';
  const isFailed = progress.status === 'failed';
  const isCancelled = progress.status === 'cancelled';

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isFailed) return <XCircle className="h-5 w-5 text-red-600" />;
    if (isCancelled) return <XCircle className="h-5 w-5 text-gray-500" />;
    return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
  };

  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-50 border-green-200';
    if (isFailed) return 'bg-red-50 border-red-200';
    if (isCancelled) return 'bg-gray-50 border-gray-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getStatusText = () => {
    if (isCompleted) return 'Import Completed';
    if (isFailed) return 'Import Failed';
    if (isCancelled) return 'Import Cancelled';
    return 'Importing...';
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Header */}
      <div className={cn('p-4 rounded-lg border', getStatusColor())}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <p className="font-semibold text-gray-900">{getStatusText()}</p>
              <p className="text-sm text-gray-600">{progress.currentOperation}</p>
            </div>
          </div>
          {isActive && onCancel && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">
            {progress.processedPosts} of {progress.totalPosts} posts
          </span>
          <span className="font-medium text-gray-900">{progress.percentComplete}%</span>
        </div>
        <Progress value={progress.percentComplete} className="h-2" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">{progress.successCount}</p>
          <p className="text-xs text-gray-500">Successful</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">{progress.errorCount}</p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg text-center">
          <p className="text-2xl font-bold text-gray-900">
            {progress.totalPosts - progress.processedPosts}
          </p>
          <p className="text-xs text-gray-500">Remaining</p>
        </div>
      </div>

      {/* Current Post */}
      {progress.currentPostTitle && isActive && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Currently processing:</p>
          <p className="text-sm font-medium text-gray-900 truncate">
            {progress.currentPostTitle}
          </p>
        </div>
      )}

      {/* Error Log */}
      {showErrors && progress.errors.length > 0 && (
        <div className="border rounded-lg">
          <div className="p-3 border-b bg-gray-50 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="font-medium text-sm text-gray-900">Error Log</span>
            <span className="ml-auto text-xs text-gray-500">
              {progress.errors.length} error{progress.errors.length !== 1 ? 's' : ''}
            </span>
          </div>
          <ScrollArea className="h-48">
            <div className="p-3 space-y-2">
              {progress.errors.map((error, index) => (
                <div
                  key={index}
                  className="p-2 bg-red-50 border border-red-100 rounded text-sm"
                >
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-red-800 truncate">
                        {error.postTitle}
                      </p>
                      <p className="text-red-600 text-xs mt-1">{error.error}</p>
                      <p className="text-red-400 text-xs mt-0.5">
                        {formatDate(error.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ImportProgress;