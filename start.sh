#!/bin/bash
cd /home/z/my-project
# Ensure static files are linked in standalone
cp -r .next/static .next/standalone/.next/static 2>/dev/null
while true; do
  DATABASE_URL="file:/home/z/my-project/db/custom.db" NODE_ENV=production node .next/standalone/server.js
  sleep 2
done
