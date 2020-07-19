let audio, ctx, audioSrc, analyser, source, bufferLength, dataArray, drawVisual;
const WIDTH = 1024;
const HEIGHT = 350;
const BAR_NUM = 64;

function start() {
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  audio.volume = 0.3;
  audio.play();

  draw();
}

function stop() {
  audio.pause();
}

function init() {
  initAudio();
  initCanvas();
}

function initAudio() {
  // Get Element
  audio = document.getElementById('audio');
  audio.src = '/test2.mp3';

  // Get Conetxt & analyser
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 2048; // Fast Fourier Transform

  // Get Data Array
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Source Connect
  source = ctx.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(ctx.destination);
}

function initCanvas() {
  // Get Element & Access Context
  canvas = document.getElementById('canvas');
  canvasCtx = canvas.getContext('2d');
}

function draw() {
  drawVisual = requestAnimationFrame(draw);
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // Bar Width, Height, Color
  let barWidth = 0;
  let barHeight = 0;
  canvasCtx.fillStyle = 'rgb(0, 0, 0)';
  
  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] - 128) * 2 + 5;

    if (barHeight <= 1) barHeight = 2;

    // Fill
    canvasCtx.fillRect(
      barWidth,
      HEIGHT - barHeight,
      WIDTH / BAR_NUM - 2,
      barHeight
    );

    // Set Next Bar X position
    barWidth += WIDTH / BAR_NUM;
  }
}
