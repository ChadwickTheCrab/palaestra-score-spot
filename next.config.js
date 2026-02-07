const { execSync } = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    COMMIT_HASH: execSync('git rev-parse --short HEAD').toString().trim(),
    GITHUB_REPO: 'https://github.com/ChadwickTheCrab/palaestra-score-spot',
  },
}

module.exports = nextConfig