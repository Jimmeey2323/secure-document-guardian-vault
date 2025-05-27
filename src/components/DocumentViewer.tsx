
import React, { useEffect, useState, useRef } from 'react';
import { UploadedFile } from '@/types/file';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { ContentProtection } from './ContentProtection';
import { WatermarkOverlay } from './WatermarkOverlay';

interface DocumentViewerProps {
  files: UploadedFile[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  sessionId: string;
}

export function DocumentViewer({ files, currentIndex, onClose, onNavigate, sessionId }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [isProtected, setIsProtected] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const currentFile = files[currentIndex];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < files.length - 1) {
      onNavigate(currentIndex + 1);
    }
  };

  const renderFileContent = () => {
    if (!currentFile) return null;

    if (currentFile.type.startsWith('image/')) {
      return (
        <img
          src={currentFile.url}
          alt={currentFile.name}
          className="max-w-full max-h-full object-contain pointer-events-none select-none"
          style={{ transform: `scale(${zoom})` }}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
        />
      );
    }

    if (currentFile.type === 'application/pdf') {
      return (
        <div
          className="w-full h-full flex items-center justify-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <iframe
            src={`${currentFile.url}#toolbar=0&navpanes=0&scrollbar=0`}
            className="w-full h-full border-0 pointer-events-none select-none"
            style={{
              minHeight: '80vh',
              maxWidth: '100%',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
            }}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            title={currentFile.name}
          />
        </div>
      );
    }

    if (currentFile.type.startsWith('text/') || currentFile.content) {
      return (
        <div
          className="bg-white dark:bg-slate-800 p-8 rounded-lg max-w-4xl mx-auto shadow-2xl select-none pointer-events-none"
          style={{ transform: `scale(${zoom})` }}
        >
          <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">
            {currentFile.name}
          </h2>
          <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed">
            {currentFile.content || 'Content preview not available'}
          </pre>
        </div>
      );
    }

    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg max-w-2xl mx-auto shadow-2xl text-center">
        <FileText size={64} className="mx-auto mb-4 text-slate-400" />
        <h2 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-200">
          {currentFile.name}
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          File type: {currentFile.type || 'Unknown'}
        </p>
        <p className="text-slate-500 dark:text-slate-500 mt-2">
          Preview not available for this file type
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
      <ContentProtection sessionId={sessionId} />
      <WatermarkOverlay sessionId={sessionId} />
      
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center space-x-4">
          <h1 className="text-white font-semibold text-lg">
            {currentFile?.name || 'Document Viewer'}
          </h1>
          <span className="text-white/60 text-sm">
            {currentIndex + 1} of {files.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Navigation */}
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button
            onClick={handleNext}
            disabled={currentIndex === files.length - 1}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={handleZoomOut}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            
            <span className="text-white text-sm min-w-[4rem] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors ml-4"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        ref={contentRef}
        className="flex-1 overflow-auto p-8 flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
      >
        {renderFileContent()}
      </div>

      {/* Footer */}
      <div className="bg-black/50 backdrop-blur-md border-t border-white/10 p-4 text-center">
        <p className="text-white/60 text-sm">
          Protected viewing session • Content cannot be copied or saved
        </p>
      </div>
    </div>
  );
}
