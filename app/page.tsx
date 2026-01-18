import { QRGenerator } from '@/components/QRGenerator';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight mb-4 text-balance">QR code generator</h1>
        </div>

        <QRGenerator />

        <div className="mt-16 md:mt-24 text-center">
          <p className="text-sm text-muted-foreground">No data is stored. All codes are generated locally in your browser.</p>
        </div>
      </div>
    </div>
  );
}
