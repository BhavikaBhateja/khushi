// Web Audio API Synthesized Sound Effects for Tactile Click Voices & Paper Interactions

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * 1. Crisp tactile click sound (UI button / switch / tap)
 */
export function playClickVoice(volume = 0.28, pitchShift = 1.0) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Oscillator 1: High transient "tick"
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const baseFreq = (1400 + Math.random() * 200) * pitchShift;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.036);

    // Subtle noise pop for mechanical texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.015);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(2800 * pitchShift, now);
    noiseFilter.Q.setValueAtTime(1.5, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.35, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
  } catch (e) {
    // Graceful fallback
  }
}

/**
 * 2. Page Flip sound (realistic paper swoosh / flutter)
 */
export function playPageFlipVoice(volume = 0.32) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const duration = 0.38;

    // Filtered noise with swoosh envelope
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Sweeping bandpass filter to simulate paper flutter
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(500, now);
    filter.frequency.exponentialRampToValueAtTime(1800, now + 0.12);
    filter.frequency.exponentialRampToValueAtTime(350, now + duration);
    filter.Q.setValueAtTime(2.0, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);

    // Subtle gentle tap at the end of the turn
    setTimeout(() => {
      playClickVoice(volume * 0.45, 0.7);
    }, 180);
  } catch (e) {}
}

/**
 * 3. Paper Uncrumple / Letter Opening rustle
 */
export function playPaperCrinkleVoice(volume = 0.3) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 4 gentle micro-crinkles
    const crinkles = [0, 0.06, 0.14, 0.22];
    crinkles.forEach((delay, idx) => {
      const crinkleLen = 0.05 + Math.random() * 0.04;
      const bufferSize = Math.floor(ctx.sampleRate * crinkleLen);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200 + idx * 300, now + delay);
      filter.Q.setValueAtTime(1.8, now + delay);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * (0.8 - idx * 0.15), now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + crinkleLen);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now + delay);
    });
  } catch (e) {}
}

/**
 * 4. Sticker Pop / Cute tap voice
 */
export function playStickerPopVoice(volume = 0.25) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.06);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  } catch (e) {}
}

let uncrumpleTimeout: any = null;

/**
 * 5. Short Crisp Letter Uncrumple Audio (Half time duration ~0.9s)
 */
export function playUncrumpleSound() {
  playPaperCrinkleVoice(0.45);

  if (typeof window !== "undefined") {
    const iframe = document.getElementById("yt-uncrumple-audio-iframe") as HTMLIFrameElement | null;
    if (iframe && iframe.contentWindow) {
      try {
        if (uncrumpleTimeout) clearTimeout(uncrumpleTimeout);

        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "seekTo",
            args: [0, true],
          }),
          "*"
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: "command",
            func: "playVideo",
            args: [],
          }),
          "*"
        );

        // Cut duration in half (~900ms) for a short crisp sound effect
        uncrumpleTimeout = setTimeout(() => {
          try {
            iframe.contentWindow?.postMessage(
              JSON.stringify({
                event: "command",
                func: "pauseVideo",
                args: [],
              }),
              "*"
            );
          } catch (e) {}
        }, 900);
      } catch (e) {}
    }
  }
}

/**
 * 6. Chapter Click Sound (Tactile button click)
 */
export function playChapterClickSound() {
  playClickVoice(0.35, 1.05);
}
