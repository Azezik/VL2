import { execSync } from 'node:child_process';

try {
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
}
