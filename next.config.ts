import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Suppress specific webpack warnings from plotly.js dependencies
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /node_modules\/glslify-deps\/sync\.js/,
      /node_modules\/glslify\/transform\.js/,
    ];
    
    return config;
  },
};

export default nextConfig;
