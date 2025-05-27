
import React, { useEffect } from 'react';

interface ContentProtectionProps {
  sessionId: string;
}

export function ContentProtection({ sessionId }: ContentProtectionProps) {
  useEffect(() => {
    // Advanced protection styles
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      
      *::selection {
        background: transparent !important;
      }
      
      *::-moz-selection {
        background: transparent !important;
      }
      
      /* Disable image dragging */
      img {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
      }
      
      /* Custom scrollbar */
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
      
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.5);
      }
    `;
    
    document.head.appendChild(style);

    // Memory protection - clear sensitive data when not in focus
    const handleFocus = () => {
      // Document is in focus - content can be displayed normally
    };

    const handleBlur = () => {
      // Document lost focus - implement additional protection
      const sensitiveElements = document.querySelectorAll('[data-sensitive]');
      sensitiveElements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.filter = 'blur(10px)';
        }
      });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Screenshot detection (experimental)
    const detectScreenshot = () => {
      // This is a basic implementation - real screenshot detection is limited
      document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen') {
          console.log('Potential screenshot detected');
          // Log security event
        }
      });
    };

    detectScreenshot();

    return () => {
      document.head.removeChild(style);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, [sessionId]);

  return null;
}
