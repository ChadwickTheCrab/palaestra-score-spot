# 🦁 Palaestra Score Spot

A beautiful gymnastics score tracking app for Palaestra Lionesses. Built with Material You design principles in black, white, and gold.

## Features

- ✅ Add gymnasts by name only
- ✅ Score entry for 4 events (Bars, Beam, Floor, Vault)
- ✅ Live team total calculation (top 3 scores)
- ✅ Individual rankings
- ✅ Generate shareable result images
- ✅ Mobile-first responsive design
- ✅ All data stored locally (localStorage)

## Deploy to Unraid

### Option 1: Docker Compose (Recommended)

1. Copy this folder to your Unraid server
2. Run:
   ```bash
   docker-compose up -d
   ```
3. Access at `http://your-unraid-ip:3000`

### Option 2: Unraid CA Template

1. Add a new container in Unraid Docker tab
2. Repository: `palaestra-score-spot` (build locally) or point to your built image
3. Port: `3000`
4. WebUI: `http://[IP]:[PORT:3000]/`

### Option 3: Build & Run Manually

```bash
# Build
docker build -t palaestra-score-spot .

# Run
docker run -d -p 3000:3000 --name palaestra palaestra-score-spot
```

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build
npm run build
```

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- html2canvas (for share images)
- lucide-react (icons)

## Data Storage

All data is stored in browser localStorage. No backend required. Data persists across sessions but is tied to the browser.

To export data: Use the share feature to generate images of results.

---

🦀 Built with love for Palaestra Lionesses