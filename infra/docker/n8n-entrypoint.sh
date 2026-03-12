#!/bin/sh
set -e

# Install the ALC Connect custom node from the mounted volume
cd /home/node/.n8n

# Create the nodes directory if it doesn't exist
mkdir -p nodes
cd nodes

# Initialize npm if no package.json
if [ ! -f package.json ]; then
  npm init -y --silent 2>/dev/null
fi

# Install from local tarball (pack the mounted node)
cd /tmp
cp -r /custom-nodes/n8n-nodes-alcconnect /tmp/n8n-nodes-alcconnect
cd /tmp/n8n-nodes-alcconnect
npm pack --silent 2>/dev/null
TARBALL=$(ls *.tgz 2>/dev/null | head -1)

if [ -n "$TARBALL" ]; then
  cd /home/node/.n8n/nodes
  npm install "/tmp/n8n-nodes-alcconnect/$TARBALL" --silent 2>/dev/null
  echo "[ALC Connect] Custom node installed successfully"
else
  echo "[ALC Connect] WARNING: Could not pack custom node"
fi

# Clean up
rm -rf /tmp/n8n-nodes-alcconnect

# Start n8n
exec n8n
