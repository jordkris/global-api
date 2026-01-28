const { execSync } = require('child_process');

const rawMsg = process.env.npm_config_message || 'Auto commit';
const msg = String(rawMsg).replace(/"/g, '\\"');

try {
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "${msg}"`, { stdio: 'inherit' });
  execSync('git push', { stdio: 'inherit' });
} catch (err) {
  console.error(err.message || err);
  process.exit(err.status || 1);
}
