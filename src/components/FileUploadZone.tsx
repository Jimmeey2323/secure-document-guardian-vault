
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadedFile } from '@/types/file';
import { Upload, File, Trash2, CheckCircle } from 'lucide-react';

interface FileUploadZoneProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
}

export function FileUploadZone({ onFilesUploaded, uploadedFiles }: FileUploadZoneProps) {
  const [isUploading, setIsUploading] = useState(false);

  const processFiles = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true);
    
    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      
      try {
        const url = URL.createObjectURL(file);
        let content = '';
        
        if (file.type.startsWith('text/') || file.type === 'application/pdf') {
          const reader = new FileReader();
          content = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result as string);
            reader.readAsText(file);
          });
        }
        
        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          content,
          lastModified: file.lastModified,
          uploadProgress: 100,
        };
        
        newFiles.push(uploadedFile);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }
    
    setIsUploading(false);
    onFilesUploaded([...uploadedFiles, ...newFiles]);
  }, [uploadedFiles, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    multiple: true,
    accept: {
      'text/*': ['.txt', '.md', '.csv'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'],
    },
  });

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    onFilesUploaded(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('word')) return '📝';
    if (type.startsWith('text/')) return '📋';
    return '📁';
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 transform hover:scale-[1.02]
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' 
            : 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
          }
          backdrop-blur-sm shadow-lg hover:shadow-xl
        `}
      >
        <input {...getInputProps()} />
        
        <div className={`transition-all duration-300 ${isDragActive ? 'scale-110' : ''}`}>
          <Upload size={48} className={`mx-auto mb-4 ${isDragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          
          {isDragActive ? (
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
              Drop your files here...
            </p>
          ) : (
            <div>
              <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Drag & drop files here, or click to select
              </p>
              <p className="text-slate-500 dark:text-slate-400">
                Supports PDF, DOC, DOCX, TXT, images and more
              </p>
            </div>
          )}
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg font-medium text-slate-700 dark:text-slate-300">Processing files...</span>
            </div>
          </div>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center">
            <CheckCircle className="mr-2 text-green-500" size={20} />
            Uploaded Files ({uploadedFiles.length})
          </h3>
          
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-2xl">{getFileIcon(file.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  title="Remove file"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
