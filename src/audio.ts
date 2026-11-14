import type { Track } from "./data";
let ToneModule: typeof import("tone") | null = null;
let cleanup: (() => void) | null = null;
let currentId: string | null = null;
let state: "idle" | "loading" | "playing" | "paused" = "idle";
let volume = 0.72;
let muted = false;
let vinylEnabled = true;
let vinyl: import("tone").Noise | null = null;
let click: import("tone").NoiseSynth | null = null;
let playRequest = 0;
const listeners = new Set<(value: typeof state) => void>();
const emit = () => listeners.forEach((fn) => fn(state));
export const audio = {
  subscribe(fn: (value: typeof state) => void) {
    listeners.add(fn);
    fn(state);
    return () => {
      listeners.delete(fn);
    };
  },
  getState: () => state,
  setVolume(value: number) {
    volume = value;
    if (ToneModule)
      ToneModule.getDestination().volume.value =
        20 * Math.log10(Math.max(0.001, muted ? 0 : volume));
  },
  setMuted(value: boolean) {
    muted = value;
    if (ToneModule) ToneModule.getDestination().mute = value;
  },
  setVinylNoise(value: boolean) {
    vinylEnabled = value;
    if (vinyl) {
      if (value && state === "playing" && vinyl.state !== "started") vinyl.start();
      if (!value && vinyl.state === "started") vinyl.stop();
    }
  },
  async play(track: Track) {
    const request = ++playRequest;
    state = "loading";
    emit();
    if (!ToneModule) ToneModule = await import("tone");
    const Tone = ToneModule;
    await Tone.start();
    if (request !== playRequest) return;
    if (currentId !== track.id || !cleanup) {
      cleanup?.();
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      transport.position = 0;
      transport.bpm.value = track.bpm;
      const master = new Tone.Gain(0.7).toDestination();
      vinyl = new Tone.Noise("pink").connect(master);
      vinyl.volume.value = -47;
      click = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.035, sustain: 0 } }).connect(master);
      click.volume.value = -31;
      const filter = new Tone.Filter(3800, "lowpass").connect(master);
      const reverb = new Tone.Reverb({ decay: 2, wet: 0.13 }).connect(filter);
      const chords = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle" },
        envelope: { attack: 0.04, decay: 0.2, sustain: 0.22, release: 0.8 },
      }).connect(reverb);
      chords.volume.value = -17;
      const bass = new Tone.MonoSynth({
        oscillator: { type: track.genre === "Synthwave" ? "sawtooth" : "sine" },
        envelope: { attack: 0.01, decay: 0.18, sustain: 0.35, release: 0.25 },
        filterEnvelope: {
          attack: 0.01,
          decay: 0.2,
          sustain: 0.2,
          release: 0.2,
          baseFrequency: 120,
          octaves: 2,
        },
      }).connect(filter);
      bass.volume.value = -8;
      const lead = new Tone.Synth({
        oscillator: { type: track.genre === "Lo-fi" ? "sine" : "triangle" },
        envelope: { attack: 0.01, decay: 0.16, sustain: 0.2, release: 0.35 },
      }).connect(reverb);
      lead.volume.value = -10;
      const kick = new Tone.MembraneSynth({
        pitchDecay: 0.06,
        octaves: 7,
        oscillator: { type: "sine" },
        envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.15 },
      }).connect(master);
      kick.volume.value = -7;
      const snare = new Tone.NoiseSynth({
        noise: { type: "pink" },
        envelope: { attack: 0.001, decay: 0.12, sustain: 0 },
      }).connect(master);
      snare.volume.value = -17;
      const hat = new Tone.MetalSynth({
        envelope: { attack: 0.001, decay: 0.05, release: 0.02 },
        harmonicity: 5,
        resonance: 3000,
        octaves: 1.5,
      }).connect(master);
      hat.volume.value = -26;
      const id = transport.scheduleRepeat((time) => {
        const step = Math.floor(transport.seconds / (60 / track.bpm / 4)) % 64;
        const beat = step % 16,
          bar = Math.floor(step / 16);
        if (beat === 0) {
          chords.triggerAttackRelease(track.chords[bar], "2n", time);
          bass.triggerAttackRelease(track.bass[bar], "8n", time);
        }
        if (beat === 8) bass.triggerAttackRelease(track.bass[bar], "8n", time);
        const note = track.melody[beat];
        if (note) lead.triggerAttackRelease(note, "8n", time);
        if (track.kick.includes(beat))
          kick.triggerAttackRelease("C1", "8n", time);
        if (track.snare.includes(beat)) snare.triggerAttackRelease("16n", time);
        if (track.hat.includes(beat)) hat.triggerAttackRelease("16n", time);
      }, "16n");
      cleanup = () => {
        if (vinyl?.state === "started") vinyl.stop();
        vinyl?.dispose(); vinyl = null;
        click?.dispose(); click = null;
        transport.clear(id);
        transport.stop();
        chords.dispose();
        bass.dispose();
        lead.dispose();
        kick.dispose();
        snare.dispose();
        hat.dispose();
        reverb.dispose();
        filter.dispose();
        master.dispose();
      };
      currentId = track.id;
    }
    Tone.getDestination().mute = muted;
    this.setVolume(volume);
    click?.triggerAttackRelease("32n");
    Tone.getTransport().start();
    state = "playing";
    if (vinylEnabled && vinyl?.state !== "started") vinyl?.start();
    emit();
  },
  pause() {
    if (ToneModule) {
      ToneModule.getTransport().pause();
      if (vinyl?.state === "started") vinyl.stop();
      state = "paused";
      emit();
    }
  },
  stop() {
    playRequest++;
    if (ToneModule) {
      ToneModule.getTransport().stop();
      ToneModule.getTransport().position = 0;
    }
    if (vinyl?.state === "started") vinyl.stop();
    state = "idle";
    emit();
  },
  dispose() {
    playRequest++;
    cleanup?.();
    cleanup = null;
    currentId = null;
    state = "idle";
    emit();
  },
};
