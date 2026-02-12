const puppeteer = require('puppeteer-stream');
const { spawn } = require('child_process');

async function startStream() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('https://TU-PAGINA-WEB.com'); // <--- CAMBIA ESTO
    await page.setViewport({ width: 1280, height: 720 });

    const stream = await puppeteer.getStream(page, { audio: true, video: true });

    const ffmpeg = spawn('ffmpeg', [
        '-i', '-', 
        '-c:v', 'libx264', '-preset', 'veryfast', '-b:v', '3000k',
        '-maxrate', '3000k', '-bufsize', '6000k',
        '-pix_fmt', 'yuv420p', '-g', '50',
        '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
        '-f', 'flv', `rtmp://a.rtmp.youtube.com/live2/${process.env.YOUTUBE_KEY}`
    ]);

    stream.pipe(ffmpeg.stdin);

    ffmpeg.stderr.on('data', (data) => console.log('FFmpeg:', data.toString()));
}

startStream();
