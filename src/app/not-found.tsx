import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold font-heading text-accent-orange mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Page Not Found</h2>
        <p className="text-text-grey mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-accent-orange hover:bg-accent-orange/80 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Go Home
          </Link>
          <Link href="/shop" className="border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all">
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
