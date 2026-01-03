"use client";

import { useEffect, useRef } from "react";

export default function HolographicWave() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let frameId: number;
    let time = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    // Configuration
    const lines = 40; // Number of wave lines
    const colorBase = "220, 38, 38"; // Deep Red
    
    const draw = () => {
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, width, height);

      // Holographic Glow
      ctx.globalCompositeOperation = "screen";
      
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        
        const yOffset = height / 2;
        const amplitude = height / 4;
        const frequency = 0.002;
        const speed = time * 0.001;
        
        // Perspective effect: Lines closer are thicker and more opaque
        const perspective = 1 - (i / lines);
        const yBase = yOffset + (i - lines / 2) * 15 * perspective;
        
        ctx.lineWidth = 1 + perspective * 2;
        ctx.strokeStyle = `rgba(${colorBase}, ${0.1 + perspective * 0.3})`;
        
        for (let x = 0; x <= width; x += 5) {
            // Complex wave function
            const y = yBase 
                    + Math.sin(x * frequency + speed + i * 0.2) * amplitude * perspective
                    + Math.cos(x * frequency * 2 - speed) * (amplitude * 0.5) * perspective;
            
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";
      
      // Vignette
      const gradient = ctx.createRadialGradient(width/2, height/2, height/2, width/2, height/2, width);
      gradient.addColorStop(0, "rgba(0,0,0,0)");
      gradient.addColorStop(1, "rgba(0,0,0,0.8)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 2; // Speed
      frameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
    />
  );
}
