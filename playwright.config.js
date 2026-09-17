import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    channel: 'chrome'
  },
  webServer: { command: 'node scripts/serve.mjs', url: 'http://127.0.0.1:3000', reuseExistingServer: !process.env.CI }
});
