/**
 * Analyzes the given audio and puts the frequency spectrum on a corresponding canvas
 * 
 * @param {*} audioFile The audiofile to be analyzed.
 * @param {String} canvasId The ID of the canvas where the frequency spectrum should be drawn.
 */
export function analyzeFrequencySpectrum(audioFile, canvasID) {
  const audio = audioFile;
  const canvas = document.getElementById(canvasID);
  const audioUrl = audio.src;
  const canvasCtx = canvas.getContext('2d');
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  let audioBuffer = null;

  fetch(audioUrl)
    .then(response => response.arrayBuffer())
    .then(buffer => new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(buffer, decodedBuffer => {
        audioBuffer = decodedBuffer;
        resolve();
      }, reject);
    }))
    .then(() => visualizeWaveform())
    .catch(error => console.error(error));

  /**
   * Actual visualization of the audio.
   */
  function visualizeWaveform() {

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    canvasCtx.clearRect(0, 0, canvasWidth, canvasHeight);

    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / canvasWidth);
    const barWidth = 1.5;
    const barSpacing = 1;
    const amplitude = canvasHeight / 2.5;

    for (let i = 0; i < canvasWidth; i++) {
      let min = 1.0;
      let max = -1.0;
      for (let j = 0; j < step; j++) {
        const value = data[i * step + j];
        if (value < min) min = value;
        if (value > max) max = value;
      }
      const x = i * (barWidth + barSpacing);
      const y = (1 + min) * amplitude + 10;
      const h = Math.max(1, (max - min) * amplitude);

      canvasCtx.fillStyle = 'green';
      canvasCtx.fillRect(x, y, barWidth, h);
    }
  }
}