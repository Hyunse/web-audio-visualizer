document.addEventListener('DOMContentLoaded', function () {
  let audioElement = document.getElementById('audio');
  let ctx, analyser, dataArray, source, bufferLength, mainCanvas;

  // Get Conetxt & ANALYSER
  ctx = new AudioContext();
  analyser = ctx.createAnalyser();
  analyser.fftSize = 1024; // Fast Fourier Transform

  // Get Data Array
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);

  // Source Connect
  source = ctx.createMediaElementSource(audioElement);
  source.connect(analyser);
  source.connect(ctx.destination);

  audio = (function (audio, ctx) {
    audio.src = '/busan.mp3';
    audio.volume = 0.3;

    function play() {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      audio.play();
    }

    function pause() {
      audio.pause();
    }

    return {
      play,
      pause,
    };
  })(audioElement, ctx);

  mainCanvas = (function (dataArray) {
    let canvas, canvasCtx, drawVisual;
    const WIDTH = 1024;
    const HEIGHT = 350;
    const BAR_NUM = 64;

    function init() {
      // Get Element & Access Context
      canvas = document.getElementById('canvas');
      canvasCtx = canvas.getContext('2d');
    }

    function draw() {
      drawVisual = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      // Bar Width, Height, Color
      let x = 0;
      let y = 0;
      const radius = WIDTH / (2*BAR_NUM);
      for (let i = 0; i < bufferLength; i++) {

        y = (dataArray[i] - 128) * 2 + 5;

        if (y <= 1) y = 0;
        
        // Draw Bottom
        canvasCtx.beginPath();
        canvasCtx.fillStyle = 'rgb(255, 159, 67)';
        canvasCtx.arc(x + radius , HEIGHT - radius, radius, 0, 2*Math.PI, true);
        canvasCtx.fill();

        // Drawing Arc
        canvasCtx.beginPath();
        canvasCtx.fillStyle = 'rgb(255, 159, 67)';
        canvasCtx.arc(x + radius , (HEIGHT- 2*y) - radius, radius, 0, 2*Math.PI, true);
        canvasCtx.fill();

        // Drawing Rect
        canvasCtx.fillRect(
          x,
          (HEIGHT- 2*y) - radius ,
          WIDTH / BAR_NUM,
          2*y
        );

        // Set Next Bar X position
        x += WIDTH / BAR_NUM + 1;
      }

      canvasCtx.stroke();
    }
    return {
      init,
      draw,
    };
  })(dataArray);

  mainCanvas.init();

  document.getElementById('start').addEventListener('click', () => {
    audio.play();
    mainCanvas.draw();
  });

  document.getElementById('pause').addEventListener('click', () => {
    audio.pause();
  });
});
