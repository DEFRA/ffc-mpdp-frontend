#!/bin/bash

# Wait for ffc-mpdp-backend to be healthy
until curl -s http://localhost:3000/healthy > /dev/null; do
  echo "Waiting for ffc-mpdp-backend to be healthy..."
  sleep 5
done

# Wait for ffc-mpdp-frontend to be healthy
until curl -s http://localhost:3001/healthy > /dev/null; do
  echo "Waiting for ffc-mpdp-frontend to be healthy..."
  sleep 5
done

# Run the acceptance tests
export HEADLESS=true
npm run test
