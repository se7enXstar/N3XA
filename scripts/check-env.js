#!/usr/bin/env node

// Check if we're in a build environment
const isBuild = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL;

if (isBuild) {
  console.log('⚠️  Build environment detected - using mock Prisma client');
  process.env.PRISMA_MOCK = 'true';
} else {
  console.log('✅ Development environment - using real Prisma client');
} 