'use client';

// Catches errors in the root layout itself (very rare, but without this
// Next.js falls back to an unstyled, unbranded error page).
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center text-black">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="max-w-md text-neutral-500">
          The app hit an unexpected error. Try reloading the page.
        </p>
        <button
          onClick={() => reset()}
          className="mt-2 cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
