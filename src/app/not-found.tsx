export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center text-black dark:bg-black dark:text-white">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="max-w-md text-neutral-500 dark:text-neutral-400">
        This page doesn&apos;t exist. Let&apos;s get you back to somewhere that does.
      </p>
      <a
        href="/"
        className="mt-2 cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        Go home
      </a>
    </div>
  );
}
