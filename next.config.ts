import type { NextConfig } from 'next';

// Baseline security headers for every route. A full script-src CSP is not
// set here: Next's inline bootstrap scripts and Google Analytics would need
// nonce plumbing via middleware to avoid breaking the app.
const securityHeaders = [
  // Disallow embedding the site in iframes (clickjacking).
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'; object-src 'none'; base-uri 'self'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Only the music toggle uses audio output; nothing needs camera/mic/geo.
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
];

const nextConfig: NextConfig = {
  // No remote image hosts: every image is served from /public. Allowing
  // unused hosts lets anyone push third-party images through the optimizer
  // on this deployment's bandwidth.
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
