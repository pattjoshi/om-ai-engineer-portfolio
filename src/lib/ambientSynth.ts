// A small generative ambient-pad engine built on the Web Audio API.
//
// Why generative instead of an MP3: there is no way to source or license a
// real track here, and shipping a procedural soundscape avoids that problem
// entirely — zero file size, no copyright, and it never repeats identically
// since every note is synthesized live. The pad is a slowly breathing Am7
// chord with a drifting lowpass filter; sparse pentatonic "shimmer" notes
// are sprinkled in at random intervals, Brian-Eno-"Music for Airports"-style.

type AudioContextCtor = typeof AudioContext;

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private voices: OscillatorNode[] = [];
  private lfoNodes: OscillatorNode[] = [];
  private shimmerTimeout: ReturnType<typeof setTimeout> | null = null;
  private playing = false;

  isPlaying() {
    return this.playing;
  }

  start(volume = 0.22) {
    if (this.playing) return;

    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return;

    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(volume, ctx.currentTime + 2.5);
    this.master = master;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 900;
    filter.Q.value = 0.6;
    filter.connect(master);
    this.filter = filter;

    // Very slow filter-cutoff drift for a shifting, evolving timbre.
    const filterLFO = ctx.createOscillator();
    filterLFO.frequency.value = 0.045;
    const filterLFOGain = ctx.createGain();
    filterLFOGain.gain.value = 350;
    filterLFO.connect(filterLFOGain);
    filterLFOGain.connect(filter.frequency);
    filterLFO.start();
    this.lfoNodes.push(filterLFO);

    // Am7 pad, spread across two octaves.
    const freqs = [110, 130.81, 164.81, 196.0, 220];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      osc.detune.value = (i - freqs.length / 2) * 4;

      const voiceGain = ctx.createGain();
      const baseLevel = 0.16 / freqs.length;
      voiceGain.gain.value = baseLevel;

      // Per-voice slow amplitude "breathing".
      const ampLFO = ctx.createOscillator();
      ampLFO.frequency.value = 0.07 + i * 0.015;
      const ampLFOGain = ctx.createGain();
      ampLFOGain.gain.value = baseLevel * 0.5;
      ampLFO.connect(ampLFOGain);
      ampLFOGain.connect(voiceGain.gain);
      ampLFO.start();
      this.lfoNodes.push(ampLFO);

      osc.connect(voiceGain);
      voiceGain.connect(filter);
      osc.start();
      this.voices.push(osc);
    });

    this.playing = true;
    this.scheduleShimmer();
  }

  private scheduleShimmer = () => {
    if (!this.playing || !this.ctx || !this.master) return;
    const ctx = this.ctx;
    const pentatonic = [440, 493.88, 587.33, 659.25, 739.99, 880];
    const freq = pentatonic[Math.floor(Math.random() * pentatonic.length)];

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = freq;

    const g = ctx.createGain();
    g.gain.value = 0;
    const now = ctx.currentTime;
    g.gain.linearRampToValueAtTime(0.05, now + 1.5);
    g.gain.linearRampToValueAtTime(0, now + 4);

    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.random() * 2 - 1;

    osc.connect(g);
    g.connect(panner);
    panner.connect(this.master);
    osc.start(now);
    osc.stop(now + 4.2);

    const nextDelay = 6000 + Math.random() * 9000;
    this.shimmerTimeout = setTimeout(this.scheduleShimmer, nextDelay);
  };

  stop() {
    if (!this.playing || !this.ctx) return;
    const ctx = this.ctx;
    const master = this.master;

    if (master) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 1);
    }
    if (this.shimmerTimeout) {
      clearTimeout(this.shimmerTimeout);
      this.shimmerTimeout = null;
    }

    const voices = this.voices;
    const lfos = this.lfoNodes;
    this.voices = [];
    this.lfoNodes = [];
    this.playing = false;

    setTimeout(() => {
      voices.forEach((o) => {
        try {
          o.stop();
        } catch {
          // already stopped
        }
      });
      lfos.forEach((o) => {
        try {
          o.stop();
        } catch {
          // already stopped
        }
      });
      ctx.close();
    }, 1100);

    this.ctx = null;
    this.master = null;
    this.filter = null;
  }
}
