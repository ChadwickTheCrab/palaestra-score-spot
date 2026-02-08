const { execSync } = require('child_process');

// Get commit hash safely (handles Docker builds where git isn't available)
function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    // Truncate to 7 chars to match GitHub short hash
    return (process.env.GIT_COMMIT || 'dev').slice(0, 7);
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    COMMIT_HASH: getCommitHash(),
    GITHUB_REPO: 'https://github.com/ChadwickTheCrab/palaestra-score-spot',
  },
}

module.exports = nextConfig