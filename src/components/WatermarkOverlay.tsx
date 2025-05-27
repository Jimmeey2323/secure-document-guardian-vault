
import React from 'react';

interface WatermarkOverlayProps {
  sessionId: string;
}

export function WatermarkOverlay({ sessionId }: WatermarkOverlayProps) {
  const timestamp = new Date().toLocaleString();
  
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      <div className="relative w-full h-full">
        {/* Repeating watermark pattern */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-white/5 font-mono text-xs transform rotate-12 select-none"
            style={{
              left: `${(i % 5) * 20}%`,
              top: `${Math.floor(i / 5) * 25}%`,
              transform: 'rotate(-45deg)',
            }}
          >
            <div className="space-y-2">
              <div>SecureDoc Viewer</div>
              <div>{sessionId}</div>
              <div>{timestamp}</div>
            </div>
          </div>
        ))}
        
        {/* Corner watermarks */}
        <div className="absolute top-4 left-4 text-white/10 font-mono text-xs">
          Session: {sessionId.slice(-8)}
        </div>
        
        <div className="absolute top-4 right-4 text-white/10 font-mono text-xs">
          {timestamp}
        </div>
        
        <div className="absolute bottom-4 left-4 text-white/10 font-mono text-xs">
          Protected Content
        </div>
        
        <div className="absolute bottom-4 right-4 text-white/10 font-mono text-xs">
          SecureDoc
        </div>
      </div>
    </div>
  );
}
