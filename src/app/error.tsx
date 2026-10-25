'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[APP-ERROR]', error.message, error.digest, error.stack);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center text-black dark:bg-black dark:text-white">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-neutral-500 dark:text-neutral-400">
        That wasn&apos;t supposed to happen. You can try again, or head back home.
      </p>
      <div className="mt-2 flex gap-3">
        <button
          onClick={() => reset()}
          className="cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Try again
        </button>
        <a
          href="/"
          className="cursor-pointer rounded-full border border-neutral-300 px-5 py-2 text-sm font-medium transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
