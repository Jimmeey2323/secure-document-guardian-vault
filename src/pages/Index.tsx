
import React, { useState, useEffect } from 'react';
import { FileUploadZone } from '@/components/FileUploadZone';
import { DocumentViewer } from '@/components/DocumentViewer';
import { SecurityManager } from '@/components/SecurityManager';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Navbar } from '@/components/Navbar';
import { UploadedFile } from '@/types/file';

const Index = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const handleFilesUploaded = (files: UploadedFile[]) => {
    setUploadedFiles(files);
    console.log('Files uploaded:', files.length);
  };

  const handleProcessFiles = () => {
    if (uploadedFiles.length > 0) {
      setIsViewerOpen(true);
      setCurrentFileIndex(0);
    }
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
  };

  const handleFileNavigation = (index: number) => {
    if (index >= 0 && index < uploadedFiles.length) {
      setCurrentFileIndex(index);
    }
  };

  return (
    <ThemeProvider>
      <SecurityManager sessionId={sessionId} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Navbar />
        
        {!isViewerOpen ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  SecureDoc Viewer
                </h1>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Ultra-secure document viewing platform with advanced protection features
                </p>
              </div>

              <FileUploadZone 
                onFilesUploaded={handleFilesUploaded}
                uploadedFiles={uploadedFiles}
              />

              {uploadedFiles.length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleProcessFiles}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                  >
                    Process Files ({uploadedFiles.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <DocumentViewer
            files={uploadedFiles}
            currentIndex={currentFileIndex}
            onClose={handleCloseViewer}
            onNavigate={handleFileNavigation}
            sessionId={sessionId}
          />
        )}
      </div>
    </ThemeProvider>
  );
};

export default Index;
