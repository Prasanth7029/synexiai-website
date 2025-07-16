#!/bin/bash

echo "🛠 Building SynexiAI for production..."
npm run build

echo "🔁 Restructuring dist folder for GitHub Pages base path (/synexiai-website)..."
rm -rf dist-temp
mv dist dist-temp
mkdir dist
mv dist-temp dist/synexiai-website

echo "🚀 Launching local preview server..."
npx serve dist --single
