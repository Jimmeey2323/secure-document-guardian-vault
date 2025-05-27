
import React, { useEffect } from 'react';

interface SecurityManagerProps {
  sessionId: string;
}

export function SecurityManager({ sessionId }: SecurityManagerProps) {
  useEffect(() => {
    // Safe console logging function
    const safeLog = (message: string) => {
      if (typeof console !== 'undefined' && console && console.log) {
        console.log(message);
      }
    };

    // Safe console clear function
    const safeClear = () => {
      if (typeof console !== 'undefined' && console && console.clear) {
        console.clear();
      }
    };

    safeLog('Enhanced Security Manager initialized for session: ' + sessionId);

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // More selective keyboard shortcut blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block specific dangerous combinations only
      const blockedCombinations = [
        { ctrl: true, shift: true, key: 'I' }, // DevTools
        { ctrl: true, shift: true, key: 'J' }, // Console
        { ctrl: true, shift: true, key: 'C' }, // Inspect
        { ctrl: true, key: 'U' }, // View Source
        { key: 'F12' }, // DevTools
      ];

      for (const combo of blockedCombinations) {
        const ctrlMatch = combo.ctrl ? (e.ctrlKey || e.metaKey) : !e.ctrlKey && !e.metaKey;
        const shiftMatch = combo.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = combo.key ? e.key === combo.key : true;
        
        if (ctrlMatch && shiftMatch && keyMatch) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          return false;
        }
      }
    };

    // Block all text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Block drag operations
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Block copy/paste operations
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    // Less aggressive print screen detection
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        safeLog('Print screen detected - clearing clipboard');
        // Clear clipboard only
        if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
      }
    };

    // Less aggressive developer tools detection
    let devtools = { open: false };
    const threshold = 200; // Increased threshold to reduce false positives

    const detectDevTools = () => {
      try {
        if (typeof window === 'undefined') return;
        
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        
        if (widthThreshold || heightThreshold) {
          if (!devtools.open) {
            devtools.open = true;
            safeClear();
            safeLog('%cDeveloper tools detected - access blocked');
            
            // Only show warning, don't blur content
            if (typeof document !== 'undefined' && document.body) {
              const warning = document.createElement('div');
              if (warning && warning.style) {
                warning.style.cssText = `
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  background: rgba(255, 0, 0, 0.9);
                  color: white;
                  padding: 10px;
                  border-radius: 5px;
                  z-index: 999999;
                  font-family: monospace;
                  font-size: 12px;
                `;
                warning.textContent = 'Developer tools detected';
                document.body.appendChild(warning);
                
                setTimeout(() => {
                  if (warning.parentNode) {
                    warning.parentNode.removeChild(warning);
                  }
                }, 3000);
              }
            }
          }
        } else {
          if (devtools.open) {
            devtools.open = false;
          }
        }
      } catch (error) {
        // Silently handle errors in dev tools detection
      }
    };

    // Add selective event listeners with safety checks
    if (typeof document !== 'undefined') {
      document.addEventListener('contextmenu', handleContextMenu, true);
      document.addEventListener('keydown', handleKeyDown, true);
      document.addEventListener('keyup', handleKeyUp, true);
      document.addEventListener('selectstart', handleSelectStart, true);
      document.addEventListener('dragstart', handleDragStart, true);
      document.addEventListener('copy', handleCopy, true);
      document.addEventListener('cut', handleCopy, true);
      document.addEventListener('paste', handleCopy, true);
    }
    
    // Less frequent dev tools detection
    const devToolsInterval = setInterval(detectDevTools, 500);
    
    // Cleanup function
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('contextmenu', handleContextMenu, true);
        document.removeEventListener('keydown', handleKeyDown, true);
        document.removeEventListener('keyup', handleKeyUp, true);
        document.removeEventListener('selectstart', handleSelectStart, true);
        document.removeEventListener('dragstart', handleDragStart, true);
        document.removeEventListener('copy', handleCopy, true);
        document.removeEventListener('cut', handleCopy, true);
        document.removeEventListener('paste', handleCopy, true);
      }
      
      if (devToolsInterval) {
        clearInterval(devToolsInterval);
      }
      
      // Reset styles safely
      if (typeof document !== 'undefined' && document.body && document.body.style) {
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
      }
    };
  }, [sessionId]);

  return null;
}
