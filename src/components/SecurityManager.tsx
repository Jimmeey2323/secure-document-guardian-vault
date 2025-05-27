
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

    // Comprehensive keyboard shortcut blocking
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block all Ctrl/Cmd combinations
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Block function keys
      if (e.key.startsWith('F') && e.key.length > 1) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Block specific dangerous keys
      const blockedKeys = ['PrintScreen', 'Insert', 'Delete', 'Home', 'End', 'PageUp', 'PageDown'];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }

      // Block Alt combinations
      if (e.altKey) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
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

    // Enhanced print screen detection
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        console.log('Print screen detected - clearing clipboard');
        // Clear clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('').catch(() => {});
        }
        // Blur the screen temporarily
        document.body.style.filter = 'blur(20px)';
        setTimeout(() => {
          document.body.style.filter = 'none';
        }, 1000);
      }
    };

    // Enhanced developer tools detection
    let devtools = { open: false };
    const threshold = 160;

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log('%cDeveloper tools detected - access blocked', 'color: red; font-size: 20px;');
          // Blur the entire page
          document.body.style.filter = 'blur(10px)';
          document.body.style.pointerEvents = 'none';
        }
      } else {
        if (devtools.open) {
          devtools.open = false;
          document.body.style.filter = 'none';
          document.body.style.pointerEvents = 'auto';
        }
      }
    };

    // Block window focus loss
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(20px)';
        document.body.style.pointerEvents = 'none';
      } else {
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
      }
    };

    // Block window blur
    const handleBlur = () => {
      document.body.style.filter = 'blur(20px)';
      document.body.style.pointerEvents = 'none';
    };

    const handleFocus = () => {
      if (!devtools.open) {
        document.body.style.filter = 'none';
        document.body.style.pointerEvents = 'auto';
      }
    };

    // Add comprehensive event listeners
    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);
    document.addEventListener('selectstart', handleSelectStart, true);
    document.addEventListener('dragstart', handleDragStart, true);
    document.addEventListener('copy', handleCopy, true);
    document.addEventListener('cut', handleCopy, true);
    document.addEventListener('paste', handleCopy, true);
    document.addEventListener('visibilitychange', handleVisibilityChange, true);
    window.addEventListener('blur', handleBlur, true);
    window.addEventListener('focus', handleFocus, true);
    
    // Multiple dev tools detection methods
    const devToolsInterval = setInterval(detectDevTools, 100);
    
    // Console protection
    const originalConsole = { ...console };
    Object.keys(console).forEach(key => {
      if (typeof console[key as keyof Console] === 'function') {
        (console as any)[key] = () => {};
      }
    });

    // Override common debugging functions
    (window as any).debugger = undefined;
    (window as any).console = undefined;

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
      document.removeEventListener('visibilitychange', handleVisibilityChange, true);
      window.removeEventListener('blur', handleBlur, true);
      window.removeEventListener('focus', handleFocus, true);
      clearInterval(devToolsInterval);
      
      // Restore console
      Object.assign(console, originalConsole);
      
      // Reset styles
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    };
  }, [sessionId]);

  return null;
}
