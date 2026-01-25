import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  serverExternalPackages: [
    '@elysiajs/openapi',
    '@elysiajs/opentelemetry',
    '@elysiajs/cors',
    '@elysiajs/eden',
    'elysia',
    '@opentelemetry/sdk-trace-node',
    '@opentelemetry/exporter-trace-otlp-proto',
  ],
};

export default nextConfig;
