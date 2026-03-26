import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { FileData } from '../types';

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void;
  files: FileData[];
  onRemoveFile: (index: number) => void;
}

export function FileUpload({ onFilesSelected, files, onRemoveFile }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        onFilesSelected([{ name: file.name, type: file.type, base64 }]);
      };
      reader.readAsDataURL(file);
    });
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'text/plain': ['.txt']
    }
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
          isDragActive ? "border-blue-500 bg-blue-50/50" : "border-gray-200 hover:border-blue-400 hover:bg-gray-50/50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-blue-50 text-blue-600">
            <Upload className="w-8 h-8" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? "Drop the files here" : "Upload financial documents"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Drag & drop PDFs, images, or text files (Annual Reports, Balance Sheets, etc.)
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
              </div>
              <button
                onClick={() => onRemoveFile(index)}
                className="p-1 hover:bg-red-50 hover:text-red-500 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
