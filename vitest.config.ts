import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    reporters: 'verbose',
    testTimeout: 30000,
    hookTimeout: 30000,
    // Aplica o ambiente customizado apenas aos testes
    environmentMatchGlobs: [
      ['./test/**', './src/vitest-environments/knex.ts'],
      ['./src/**/*.test.ts', './src/vitest-environments/knex.ts'],
    ],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/database/migrations/',
        'src/database/seeds/',
        '**/*.config.ts',
        '**/*.d.ts',
        'src/vitest-environments/**',
        'test/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    target: 'node18',
  },
});

