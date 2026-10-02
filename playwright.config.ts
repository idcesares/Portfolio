import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/browser',
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4322',
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
    },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'corepack pnpm dev --host 127.0.0.1 --port 4322 --ignore-lock',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
