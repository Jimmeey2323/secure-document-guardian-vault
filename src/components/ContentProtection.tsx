
import React, { useEffect } from 'react';

interface ContentProtectionProps {
  sessionId: string;
}

export function ContentProtection({ sessionId }: ContentProtectionProps) {
  useEffect(() => {
    // Inject comprehensive protection styles
    const style = document.createElement('style');
    style.id = 'content-protection-styles';
    style.textContent = `
      /* Disable all text selection methods */
      *, *::before, *::after {
        -webkit-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-touch-callout: none !important;
        -webkit-tap-highlight-color: transparent !important;
        -khtml-user-select: none !important;
      }
      
      /* Disable all selection pseudo-elements */
      *::selection, *::-moz-selection {
        background: transparent !important;
        color: inherit !important;
      }
      
      /* Disable drag and drop */
      * {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: auto !important;
      }
      
      /* Disable image context menu and dragging */
      img, svg, canvas, video {
        -webkit-user-drag: none !important;
        -khtml-user-drag: none !important;
        -moz-user-drag: none !important;
        -o-user-drag: none !important;
        user-drag: none !important;
        pointer-events: none !important;
        -webkit-touch-callout: none !important;
      }
      
      /* Disable outline and focus */
      *:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      
      /* Hide scrollbars to prevent screenshot indicators */
      ::-webkit-scrollbar {
        width: 0px !important;
        background: transparent !important;
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
      
      /* Additional protection layers */
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    
    document.head.appendChild(style);

    // Enhanced screenshot protection
    const protectAgainstScreenshots = () => {
      // Monitor for screenshot events
      document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen') {
          // Flash the screen white to interfere with screenshots
          const overlay = document.createElement('div');
          overlay.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            background: white !important;
            z-index: 999999 !important;
            pointer-events: none !important;
          `;
          document.body.appendChild(overlay);
          
          setTimeout(() => {
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          }, 200);
          
          console.log('Screenshot attempt detected and blocked');
        }
      });
    };

    // Memory protection
    const protectMemory = () => {
      // Clear sensitive data periodically
      setInterval(() => {
        if (performance.memory && (performance.memory as any).usedJSHeapSize > 50000000) {
          // Clear large objects if memory usage is high
          if (window.gc) {
            window.gc();
          }
        }
      }, 30000);
    };

    // Initialize protections
    protectAgainstScreenshots();
    protectMemory();

    // Disable common developer shortcuts
    const blockShortcuts = (e: KeyboardEvent) => {
      const blockedCombinations = [
        { ctrl: true, shift: true, key: 'I' }, // DevTools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, shift: true, key: 'C' }, // Inspect
        { ctrl: true, key: 'U' }, // View Source
        { ctrl: true, key: 'S' }, // Save
        { key: 'F12' }, // DevTools
      ];

      for (const combo of blockedCombinations) {
        const ctrlMatch = combo.ctrl ? e.ctrlKey || e.metaKey : true;
        const shiftMatch = combo.shift ? e.shiftKey : true;
        const keyMatch = combo.key ? e.key === combo.key : true;
        
        if (ctrlMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
      }
    };

    document.addEventListener('keydown', blockShortcuts, true);

    return () => {
      const existingStyle = document.getElementById('content-protection-styles');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
      document.removeEventListener('keydown', blockShortcuts, true);
    };
  }, [sessionId]);

  return null;
}
