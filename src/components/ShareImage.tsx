'use client';

import { useRef, useState } from 'react';
import { MeetResults, EVENT_CONFIG, EVENTS } from '@/types';
import { Download, ChevronLeft, Camera, Share2 } from 'lucide-react';

interface ShareImageProps {
  meetName: string;
  date: string;
  groupName: string;
  skillLevel: string;
  results: MeetResults;
  onBack: () => void;
}

export function ShareImage({
  meetName,
  date,
  groupName,
  skillLevel,
  results,
  onBack,
}: ShareImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateImage = async () => {
    setGenerating(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions (Instagram square format)
    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    // Background - Black with subtle gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1c1c1c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Gold accent line at top
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(40, 0, 1000, 4);

    // Lion emoji header
    ctx.font = '80px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🦁', width / 2, 100);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText('PALAESTRA', width / 2, 180);

    // Subtitle
    ctx.fillStyle = '#c9a227';
    ctx.font = '300 32px sans-serif';
    ctx.fillText('LIONESSES', width / 2, 225);

    // Meet name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px sans-serif';
    ctx.fillText(meetName, width / 2, 320);

    // Group info
    ctx.fillStyle = '#aaaaaa';
    ctx.font = '32px sans-serif';
    ctx.fillText(`${groupName} • ${skillLevel}`, width / 2, 370);

    // Date
    ctx.font = '28px sans-serif';
    ctx.fillText(new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }), width / 2, 410);

    // Team Total Section
    const teamY = 500;
    ctx.fillStyle = '#c9a227';
    ctx.font = '300 28px sans-serif';
    ctx.fillText('TEAM TOTAL', width / 2, teamY);

    ctx.font = 'bold 120px sans-serif';
    ctx.fillText(results.teamTotal.toFixed(2), width / 2, teamY + 110);

    // Divider
    ctx.fillStyle = '#333333';
    ctx.fillRect(100, teamY + 140, 880, 2);

    // Top 3 All-Arounders
    let yPos = teamY + 200;
    ctx.fillStyle = '#ffffff';
    ctx.font = '300 24px sans-serif';
    ctx.fillText('TOP ALL-AROUNDERS', width / 2, yPos);
    yPos += 60;

    const medals = ['🥇', '🥈', '🥉'];
    results.topThree.forEach((gymnast, idx) => {
      // Medal
      ctx.font = '40px serif';
      ctx.fillText(medals[idx], 150, yPos);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(gymnast.gymnast.name, 220, yPos);

      // Score
      ctx.textAlign = 'right';
      ctx.fillStyle = '#c9a227';
      ctx.fillText(gymnast.totalScore.toFixed(2), 930, yPos);

      ctx.textAlign = 'center';
      yPos += 70;
    });

    // Individual Rankings
    yPos += 40;
    ctx.fillStyle = '#666666';
    ctx.font = '20px sans-serif';
    ctx.fillText('ALL RANKINGS', width / 2, yPos);
    yPos += 50;

    // Draw rankings table
    results.gymnasts.forEach((result, idx) => {
      if (idx >= 8) return; // Limit to top 8 for space

      const rowY = yPos + idx * 55;
      
      // Rank
      ctx.fillStyle = idx < 3 ? '#c9a227' : '#888888';
      ctx.font = idx < 3 ? 'bold 28px sans-serif' : '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`#${result.rank}`, 100, rowY);

      // Name
      ctx.fillStyle = '#ffffff';
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(result.gymnast.name, 160, rowY);

      // Total
      ctx.textAlign = 'right';
      ctx.fillStyle = idx < 3 ? '#c9a227' : '#aaaaaa';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(result.totalScore.toFixed(2), 980, rowY);

      // Separator line
      if (idx < Math.min(results.gymnasts.length - 1, 7)) {
        ctx.fillStyle = '#333333';
        ctx.fillRect(80, rowY + 15, 920, 1);
      }
    });

    // Footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#555555';
    ctx.font = '20px sans-serif';
    ctx.fillText('Powered by Palaestra Score Spot', width / 2, height - 60);

    // Generate image URL
    const url = canvas.toDataURL('image/png', 1.0);
    setImageUrl(url);
    setGenerating(false);
  };

  const downloadImage = () => {
    if (!imageUrl) return;
    
    const link = document.createElement('a');
    link.download = `palaestra-${meetName.replace(/\s+/g, '-').toLowerCase()}-${date}.png`;
    link.href = imageUrl;
    link.click();
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-on-surface-variant hover:text-on-surface transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Results
      </button>

      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/20 mb-3">
          <Camera className="w-7 h-7 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-on-surface">Share Results</h2>
        <p className="text-sm text-on-surface-variant mt-1">
          Create a beautiful image for social media
        </p>
      </div>

      {/* Hidden Canvas */}
      <canvas
        ref={canvasRef}
        className="hidden"
      />

      {/* Preview */}
      {imageUrl && (
        <div className="space-y-4">
          <div className="card overflow-hidden elevation-3">
            <img
              src={imageUrl}
              alt="Meet Results"
              className="w-full h-auto"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={downloadImage}
              className="py-3 bg-accent text-on-primary rounded-xl font-semibold
                         flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download
            </button>
            
            <button
              onClick={generateImage}
              className="py-3 bg-surface-variant text-on-surface rounded-xl font-medium
                         flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Regenerate
            </button>
          </div>

          {/* Share Instructions */}
          <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl">
            <h4 className="font-medium text-accent mb-2 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              How to Share
            </h4>
            <ol className="text-sm text-on-surface-variant space-y-1.5 list-decimal list-inside">
              <li>Tap "Download" to save the image</li>
              <li>Open Instagram, Facebook, or your favorite app</li>
              <li>Post the image and tag your gym!</li>
            </ol>
          </div>
        </div>
      )}

      {/* Generate Button */}
      {!imageUrl && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📸</div>
          <p className="text-on-surface-variant mb-6">
            Generate a shareable image with all the meet results
          </p>
          <button
            onClick={generateImage}
            disabled={generating}
            className="px-8 py-4 bg-accent text-on-primary rounded-xl font-semibold text-lg
                       flex items-center justify-center gap-2 mx-auto
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <>
                <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Camera className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}