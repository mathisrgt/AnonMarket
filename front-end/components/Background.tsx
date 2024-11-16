'use client';
import { useEffect, useState } from 'react';

export default function Background() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-white">
            {/* Pink/Red gradient */}
            <div 
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    top: '-20%',
                    right: '-20%',
                    background: 'radial-gradient(circle at center, rgba(255,192,203,0.4) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'translate(0, 0)',
                }}
            />
            
            {/* Orange gradient */}
            <div 
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    bottom: '-20%',
                    left: '-20%',
                    background: 'radial-gradient(circle at center, rgba(255,165,0,0.3) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'translate(0, 0)',
                }}
            />
            
            {/* Yellow gradient */}
            <div 
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                    top: '20%',
                    left: '10%',
                    background: 'radial-gradient(circle at center, rgba(255,255,0,0.2) 0%, rgba(255,255,255,0) 70%)',
                    transform: 'translate(0, 0)',
                }}
            />
        </div>
    );
}