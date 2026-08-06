import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**': ['./media/**/*', './documents/**/*'],
  },
};

export default withPayload(nextConfig);
