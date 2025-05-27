
import React from 'react';

interface WatermarkOverlayProps {
  sessionId: string;
}

export function WatermarkOverlay({ sessionId }: WatermarkOverlayProps) {
  const timestamp = new Date().toLocaleString();
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <div className="relative w-full h-full">
        {/* Dense repeating watermark pattern */}
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-red-500/20 font-mono text-xs transform select-none"
            style={{
              left: `${(i % 10) * 10}%`,
              top: `${Math.floor(i / 10) * 10}%`,
              transform: `rotate(${-45 + (i % 3) * 15}deg)`,
              zIndex: 9999,
            }}
          >
            <div className="space-y-1">
              <div>CONFIDENTIAL</div>
              <div>{sessionId.slice(-8)}</div>
              <div>{timestamp}</div>
            </div>
          </div>
        ))}
        
        {/* Corner watermarks with higher opacity */}
        <div className="absolute top-4 left-4 text-red-600/50 font-mono text-sm font-bold">
          PROTECTED SESSION: {sessionId.slice(-8)}
        </div>
        
        <div className="absolute top-4 right-4 text-red-600/50 font-mono text-sm font-bold">
          {timestamp}
        </div>
        
        <div className="absolute bottom-4 left-4 text-red-600/50 font-mono text-sm font-bold">
          CONFIDENTIAL CONTENT
        </div>
        
        <div className="absolute bottom-4 right-4 text-red-600/50 font-mono text-sm font-bold">
          NO SCREENSHOTS
        </div>

        {/* Center watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-red-600/30 font-mono text-2xl font-bold rotate-45">
          SECURE DOCUMENT
        </div>
      </div>
    </div>
  );
}
