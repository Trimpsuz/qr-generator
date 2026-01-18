'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, Copy, Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useCallback, useRef, useState } from 'react';

export function QRGenerator() {
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const qrValue = inputValue.trim();

  const handleCopy = useCallback(async () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      try {
        const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
        if (blob) {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    };
    img.src = url;
  }, []);

  const handleDownload = useCallback(() => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      ctx.drawImage(img, 0, 0, 512, 512);
      URL.revokeObjectURL(url);

      const link = document.createElement('a');
      link.download = `qrcode-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = url;
  }, []);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="grid gap-8">
        <Card className="p-6 bg-card border-border justify-center">
          <div className="space-y-2">
            <Label htmlFor="link-input" className="text-muted-foreground">
              Enter URL or text
            </Label>
            <Input
              id="link-input"
              type="url"
              placeholder="https://example.com"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-muted border-border focus:border-primary"
            />
          </div>

          <p className="text-xs text-muted-foreground">{inputValue.length > 0 ? `${inputValue.length} characters` : 'Start typing to generate your QR code'}</p>
        </Card>

        <Card className="p-6 bg-card border-border flex flex-col items-center justify-center">
          <div className="p-4">
            <div className="bg-transparent overflow-clip rounded-md transition-all duration-300">
              <QRCodeSVG value={qrValue} size={180} level="H" bgColor="transparent" fgColor="#fafafa" />
            </div>
            <div ref={qrRef} className="invisible absolute">
              <QRCodeSVG value={qrValue} size={180} level="H" bgColor="#fff" fgColor="#000" />
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <Button onClick={handleCopy} variant="secondary" className="flex-1 gap-2 cursor-pointer" disabled={!inputValue.trim()}>
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button onClick={handleDownload} className="flex-1 gap-2 cursor-pointer" disabled={!inputValue.trim()}>
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
