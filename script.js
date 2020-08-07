const WIDTH = 1024;
const HEIGHT = 500;
const BAR_NUM = 64;
const FFTSIZE = 1024;
const blob = window.URL || window.webkitURL;
let audio;
let file = document.getElementById('exfile');
let color = document.getElementById('color');
let ctx,
  analyser,
  dataArray,
  source,
  bufferLength,
  mainCanvas,
  canvas,
  canvasCtx,
  canvasCtxBottom;

file.onchange = function () {
  audio = document.getElementById('audio');
  const reader = new FileReader();
  reader.onload = function (evt) {
    url = evt.target.result;
    audio.src = url;
    audio.controls = true;
    audio.crossOrigin = 'anonymous';
    audio.play();
    ctx.resume();
  };
  reader.readAsDataURL(this.files[0]);
  draw();
};

color.onchange = function () {
  const rgb = getRGB(this.value);

  canvasCtx.fillStyle = rgb;
};

function init() {
  audio = document.getElementById('audio');

  // Get Conetxt & ANALYSER
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = FFTSIZE; // Fast Fourier Transform

  // Get Data Array
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Source Connect
  source = ctx.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(ctx.destination);

  // Get Element & Access Context
  canvas = document.getElementById('canvas');
  canvasCtx = canvas.getContext('2d');

  canvasCtx.fillStyle = 'rgb(255, 159, 67)';
}

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

  // Bar x, y, position
  let x = 0;
  let y = 0;
  const radius = WIDTH / (2 * BAR_NUM);

  for (let i = 0; i < bufferLength; i++) {
    y = (dataArray[i] - 128) * 2;

    if (y <= 1) y = 0;
    
    // Drawing Rect
    canvasCtx.fillRect(x, HEIGHT - y - radius, WIDTH / BAR_NUM, y);

    // // Drawing Arc
    canvasCtx.beginPath();
    canvasCtx.arc(x + radius, HEIGHT - radius, radius, 0, Math.PI, false);
    canvasCtx.arc(x + radius, HEIGHT - y - radius, radius, 0, Math.PI, true);
    canvasCtx.closePath();
    canvasCtx.fill();

    // Set Next Bar X position
    x += WIDTH / BAR_NUM + 5;
  }
}

function getRGB(hex) {
  let rgb = hex.match(/[A-Za-z0-9]{2}/g);
  rgb = rgb.map((v) => parseInt(v, 16));

  return `rgb(${rgb.join(',')})`;
}