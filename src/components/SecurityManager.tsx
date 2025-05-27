
import React, { useEffect } from 'react';

interface SecurityManagerProps {
  sessionId: string;
}

export function SecurityManager({ sessionId }: SecurityManagerProps) {
  useEffect(() => {
    console.log('Security Manager initialized for session:', sessionId);

    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Disable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable common shortcuts
      if (e.ctrlKey || e.metaKey) {
        const blockedKeys = ['c', 'v', 'a', 's', 'p', 'u', 'r', 'z', 'y', 'i', 'j'];
        if (blockedKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }

      // Disable F12, F5, etc.
      const blockedKeys = ['F12', 'F5', 'F1', 'F3', 'F7'];
      if (blockedKeys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Disable Ctrl+Shift combinations
      if (e.ctrlKey && e.shiftKey) {
        const blockedShiftKeys = ['i', 'j', 'c', 's'];
        if (blockedShiftKeys.includes(e.key.toLowerCase())) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    // Disable text selection
    const handleSelectStart = (e: Event) => {
      e.preventDefault();
      return false;
    };

    // Disable drag operations
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      return false;
    };

    // Print screen detection (limited browser support)
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        console.log('Print screen detected - security event logged');
        // Clear clipboard if possible
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('');
        }
      }
    };

    // Developer tools detection
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          console.clear();
          console.log('Developer tools detected - clearing console');
          // Could trigger additional security measures here
        }
      } else {
        devtools.open = false;
      }
    };

    // Blur content when window loses focus
    const handleVisibilityChange = () => {
      const body = document.body;
      if (document.hidden) {
        body.style.filter = 'blur(5px)';
        body.style.pointerEvents = 'none';
      } else {
        body.style.filter = 'none';
        body.style.pointerEvents = 'auto';
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('selectstart', handleSelectStart);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Check for dev tools periodically
    const devToolsInterval = setInterval(detectDevTools, 500);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectstart', handleSelectStart);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(devToolsInterval);
      
      // Reset styles
      document.body.style.filter = 'none';
      document.body.style.pointerEvents = 'auto';
    };
  }, [sessionId]);

  return null; // This component doesn't render anything
}
