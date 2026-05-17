import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, X, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileClear: () => void;
  selectedFile: File | null;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onFileClear,
  selectedFile,
  accept = '.xml',
  maxSize = 50,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file type
    if (!file.name.endsWith('.xml')) {
      setError('Please upload an XML file');
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) return;

      if (validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange, disabled]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleClear = () => {
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileClear();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all',
            isDragging
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Upload className="h-6 w-6 text-blue-600" />
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                XML files only (max {maxSize}MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border rounded-lg p-4 bg-gray-50">
          <button
            onClick={handleClear}
            disabled={disabled}
            className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <FileText className="h-5 w-5 text-green-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-gray-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            
            <Check className="h-5 w-5 text-green-600" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;