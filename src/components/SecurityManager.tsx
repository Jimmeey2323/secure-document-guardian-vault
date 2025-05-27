
import React, { useEffect } from 'react';

interface SecurityManagerProps {
  sessionId: string;
}

export function SecurityManager({ sessionId }: SecurityManagerProps) {
  useEffect(() => {
    console.log('Enhanced Security Manager initialized for session:', sessionId);

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
        console.log('Print screen detected - clearing clipboard');
        // Clear clipboard only
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
      }
    };

    // Less aggressive developer tools detection
    let devtools = { open: false };
    const threshold = 200; // Increased threshold to reduce false positives

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log('%cDeveloper tools detected - access blocked', 'color: red; font-size: 20px;');
          // Only show warning, don't blur content
          const warning = document.createElement('div');
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
      } else {
        if (devtools.open) {
          devtools.open = false;
        }
      }
    };

    // Remove aggressive window focus/blur handlers that were causing issues

    // Add selective event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCopy, true);
    document.addEventListener('paste', handleCopy, true);
    
    // Less frequent dev tools detection
    const devToolsInterval = setInterval(detectDevTools, 500);
    
    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
      document.removeEventListener('selectstart', handleSelectStart, true);
      document.removeEventListener('dragstart', handleDragStart, true);
      document.removeEventListener('copy', handleCopy, true);
      document.removeEventListener('cut', handleCopy, true);
      document.removeEventListener('paste', handleCopy, true);
      clearInterval(devToolsInterval);
      
      // Reset styles
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    };
  }, [sessionId]);

  return null;
}
