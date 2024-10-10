FROM node:18

# Install necessary dependencies for Chrome/Chromium
RUN apt-get update && apt-get install -y \
    libnss3 \
    libgconf-2-4 \
    libxi6 \
    libxcursor1 \
    libxcomposite1 \
    libasound2 \
    libatk1.0-0 \
    libxrandr2 \
    libxdamage1 \
    libxkbcommon0 \
    libx11-xcb1 \
    libgbm1 \
    libgtk-3-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libpangoft2-1.0-0 \
    libcups2 \
    libxss1 \
    fonts-liberation \
    xdg-utils \
    wget \
    curl \
    unzip

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Make the start-tests.sh script executable
RUN chmod +x start-tests.sh

# Set the entrypoint to the start-tests.sh script
ENTRYPOINT ["./start-tests.sh"]
