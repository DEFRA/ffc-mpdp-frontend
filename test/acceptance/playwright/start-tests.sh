#!/bin/bash

# Wait for ffc-mpdp-backend to be healthy
until curl -s http://ffc-mpdp-backend:3000/healthy > /dev/null; do
  echo "Waiting for ffc-mpdp-backend to be healthy..."
  sleep 5
done

# Wait for ffc-mpdp-frontend to be healthy
until curl -s http://ffc-mpdp-frontend:3001/healthy > /dev/null; do
  echo "Waiting for ffc-mpdp-frontend to be healthy..."
  sleep 5
done

# Run the acceptance tests

PLAYWRIGHT_CONFIG_FILE="playwright.config.js"

# Extract the headless value for the specified Playwright project
IS_HEADLESS=$(awk -v project="$PROJECT_NAME" '
  $0 ~ "name: \"" project "\"" {found=1}
  found && $0 ~ /headless:/ {
    gsub(/[^a-z]/, "", $2); print $2; exit
  }' $PLAYWRIGHT_CONFIG_FILE)

echo "IS_HEADLESS value is ... $IS_HEADLESS"

# Check if headless is set to false
if [ "$IS_HEADLESS" == "false" ]; then
  echo "Running in headed mode, starting Xvfb..."

  # Clean up any existing lock files
  rm -f /tmp/.X*-lock

  # Start Xvfb on a different display, e.g., :1001
  DISPLAY_NUM=1002

  # Start Xvfb with logging
  Xvfb :$DISPLAY_NUM -screen 0 1024x768x16 >/tmp/xvfb.log 2>&1 &
  export DISPLAY=:$DISPLAY_NUM
  sleep 2 # Give Xvfb few seconds to start up

  # Check if Xvfb started successfully
  if ! pgrep Xvfb >/dev/null; then
    echo "Xvfb failed to start. Check /tmp/xvfb.log for details."
    exit 1
  fi

  # Run Playwright with xvfb-run
  xvfb-run --server-args="-screen 0 1024x768x16" npx playwright test --project "$PROJECT_NAME"
else
  echo "Running in headless mode, no need for Xvfb."
  # Run Playwright without xvfb-run
  npx playwright test --project "$PROJECT_NAME"
fi
