import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-serif text-[#1C2C24] mb-4">404</h1>
      <h2 className="text-2xl font-serif text-[#1C2C24] mb-2">Page Not Found</h2>
      <p className="text-[#6E7B75] max-w-md mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 bg-[#1C2C24] text-[#EBE7DF] rounded-xl font-medium tracking-wide hover:bg-[#2A3F34] transition-all shadow-md"
      >
        Return to Home
      </Link>
    </div>
  );
}
