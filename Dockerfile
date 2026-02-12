FROM node:18-slim

# Instalar FFmpeg y dependencias para Chrome
RUN apt-get update && apt-get install -y \
    ffmpeg \
    chromium \
    fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY . .

# Instalar puppeteer
RUN npm install puppeteer-stream

CMD ["node", "index.js"]
