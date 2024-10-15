# Use the official Playwright image
FROM mcr.microsoft.com/playwright:latest

# Install Chromium and other necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    chromium-browser \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-glib-1-2 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxshmfence1 \
    xdg-utils \
    xvfb \
    --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy the rest of the project files
COPY . .

# Make the start-tests.sh script executable
RUN chmod +x ./start-tests.sh

# Set the entrypoint to the start-tests.sh script
ENTRYPOINT ["./start-tests.sh"]
