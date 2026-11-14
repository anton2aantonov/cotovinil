import { spawnSync } from 'node:child_process'

const suites = {
  typecheck: ['node_modules/typescript/bin/tsc', '-b'],
  lint: ['node_modules/eslint/bin/eslint.js', '.'],
  unit: ['node_modules/vitest/vitest.mjs', 'run'],
  build: ['node_modules/vite/bin/vite.js', 'build'],
  structure: ['node_modules/@playwright/test/cli.js', 'test', 'e2e/stage4.spec.ts', '--grep', '@structure'],
  cover: ['node_modules/@playwright/test/cli.js', 'test', 'e2e/stage4.spec.ts', '--grep', '@cover'],
  player: ['node_modules/@playwright/test/cli.js', 'test', 'e2e/stage4.spec.ts', '--grep', '@player'],
  a11y: ['node_modules/@playwright/test/cli.js', 'test', 'e2e/stage4.spec.ts', '--grep', '@a11y'],
  e2e: ['node_modules/@playwright/test/cli.js', 'test'],
}
const suite = process.argv[2]
if (!Object.hasOwn(suites, suite)) {
  console.error(`Unknown suite: ${suite}`)
  process.exit(2)
}
const [script, ...args] = suites[suite]
const environment = { ...process.env, PLAYWRIGHT_CHANNEL: process.env.PLAYWRIGHT_CHANNEL ?? (process.platform === 'win32' ? 'msedge' : '') }
const result = spawnSync(process.execPath, [script, ...args], { stdio: 'inherit', env: environment })
if (result.error) { console.error(result.error); process.exit(1) }
if (result.status !== 0) process.exit(result.status ?? 1)
console.log(`${suite.toUpperCase()}_OK`)
