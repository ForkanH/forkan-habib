import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center px-6 text-center">
      <div>
        <div className="font-display text-7xl font-bold">404</div>
        <p className="text-muted-foreground mt-3">This page doesn&apos;t exist.</p>
        <Link href="/" className="inline-block mt-6 text-accent hover:underline">Go home</Link>
      </div>
    </div>
  );
}
