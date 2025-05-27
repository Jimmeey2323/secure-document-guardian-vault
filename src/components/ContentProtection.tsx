
import React, { useEffect } from 'react';

interface ContentProtectionProps {
  sessionId: string;
}

// Extend the Performance interface to include the non-standard memory property
interface PerformanceMemory {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface ExtendedPerformance extends Performance {
  memory?: PerformanceMemory;
}

export function ContentProtection({ sessionId }: ContentProtectionProps) {
  useEffect(() => {
    // Inject more balanced protection styles
    const style = document.createElement('style');
    style.id = 'content-protection-styles';
    style.textContent = `
      /* Disable text selection methods */
      *, *::before, *::after {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        -khtml-user-select: none !important;
      }
      
      /* Disable selection pseudo-elements */
      *::selection, *::-moz-selection {
        background: transparent !important;
        color: inherit !important;
      }
      
      /* Disable drag and drop for images */
      img, svg, canvas, video {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        -webkit-touch-callout: none !important;
      }
      
      /* Disable outline and focus */
      *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      
      /* Disable print styles */
      @media print {
        body * {
          visibility: hidden !important;
        }
        body::before {
          content: "Printing is not allowed" !important;
          visibility: visible !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          font-size: 24px !important;
          color: red !important;
        }
      }
    `;
    
    document.head.appendChild(style);

    // Less aggressive screenshot protection
    const protectAgainstScreenshots = () => {
      // Monitor for screenshot events without blurring screen
      document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen') {
          console.log('Screenshot attempt detected');
          // Just log it, don't interfere with display
        }
      });
    };

    // Memory protection with proper type checking
    const protectMemory = () => {
      // Clear sensitive data periodically
      setInterval(() => {
        const extendedPerformance = performance as ExtendedPerformance;
        if (extendedPerformance.memory && extendedPerformance.memory.usedJSHeapSize > 50000000) {
          // Clear large objects if memory usage is high
          const globalWindow = window as any;
          if (globalWindow.gc) {
            globalWindow.gc();
          }
        }
      }, 30000);
    };

    // Initialize protections
    protectAgainstScreenshots();
    protectMemory();

    return () => {
      const existingStyle = document.getElementById('content-protection-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, [sessionId]);

  return null;
}
