'use client'

import { useRef, useEffect } from 'react';

interface LightRaysProps {
  raysOrigin?: string;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
}

export default function LightRays({
  raysOrigin = "top-center",
  raysColor = "#E85002",
  raysSpeed = 1.0,
  lightSpread = 1.5,
  rayLength = 1.5,
  followMouse = false,
  mouseInfluence = 0,
  noiseAmount = 0.03,
  distortion = 0.01
}: LightRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawRays = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      
      gradient.addColorStop(0, `${raysColor}20`);
      gradient.addColorStop(0.5, `${raysColor}10`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    drawRays();

    window.addEventListener('resize', () => {
      resizeCanvas();
      drawRays();
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [raysColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: 'transparent',
        mixBlendMode: 'multiply'
      }}
    />
  );
}