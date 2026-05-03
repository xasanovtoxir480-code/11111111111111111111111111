#!/bin/bash
cd /home/z/my-project
while true; do
  DATABASE_URL="file:/home/z/my-project/db/custom.db" NODE_ENV=production node .next/standalone/server.js
  sleep 2
done
