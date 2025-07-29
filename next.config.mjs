/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable telemetry to avoid OpenTelemetry issues
  telemetry: false,
  
  // Configure rewrites for development
  async rewrites() {
    return [
      {
        source: "/llmsev/:path*",
        destination: "http://127.0.0.1:8000/llmsev/:path*",
      },
      {
        source: "/docs",
        destination: "http://127.0.0.1:8000/docs",
      },
      {
        source: "/openapi.json",
        destination: "http://127.0.0.1:8000/openapi.json",
      },
    ];
  },
};

export default nextConfig;