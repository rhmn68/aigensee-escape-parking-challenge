// Retro audio synthesizer & background music manager using Web Audio API + HTML5 Audio
import { useState, useEffect } from "react";

const STORAGE_KEY = "escape_parking_bgm_muted";

class AudioEngine {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  private bgmMuted: boolean = false;
  private subscribers: Set<(muted: boolean) => void> = new Set();
  private bgmStarted: boolean = false;
  private bgmInitializing: boolean = false;

  constructor() {
    // Read persisted BGM mute state
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      this.bgmMuted = saved === "true";
    } catch {
      this.bgmMuted = false;
    }
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Initializes and starts background music playback.
   * Seamlessly recovers from browser autoplay policies on first interaction.
   */
  startBgm() {
    if (this.bgmAudio) {
      if (this.bgmAudio.paused && !this.bgmMuted) {
        this.bgmAudio.play().catch(() => {});
      }
      return;
    }

    if (this.bgmInitializing) return;
    this.bgmInitializing = true;

    try {
      const audioUrl = `${import.meta.env.BASE_URL}audio/bgm.mp3`;
      const bgm = new Audio(audioUrl);
      bgm.loop = true;
      bgm.volume = 0.20;
      bgm.muted = this.bgmMuted;
      this.bgmAudio = bgm;

      const playPromise = bgm.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.bgmStarted = true;
            this.bgmInitializing = false;
          })
          .catch(() => {
            // Autoplay blocked by browser policy: register one-time user gesture handler
            this.bgmInitializing = false;
            const unlockHandler = () => {
              this.initCtx();
              if (this.bgmAudio && !this.bgmMuted) {
                this.bgmAudio.play().then(() => {
                  this.bgmStarted = true;
                }).catch(() => {});
              }
              window.removeEventListener("pointerdown", unlockHandler);
              window.removeEventListener("keydown", unlockHandler);
            };
            window.addEventListener("pointerdown", unlockHandler, { once: true });
            window.addEventListener("keydown", unlockHandler, { once: true });
          });
      }
    } catch (e) {
      console.warn("BGM initialization failed:", e);
      this.bgmInitializing = false;
    }
  }

  stopBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
      this.bgmAudio.currentTime = 0;
    }
  }

  isMuted(): boolean {
    return this.bgmMuted;
  }

  getMuted(): boolean {
    return this.bgmMuted;
  }

  toggleMute(): boolean {
    return this.setMute(!this.bgmMuted);
  }

  setMute(mute: boolean): boolean {
    this.bgmMuted = mute;
    try {
      localStorage.setItem(STORAGE_KEY, String(mute));
    } catch {}

    if (this.bgmAudio) {
      this.bgmAudio.muted = mute;
      if (!mute && this.bgmAudio.paused) {
        this.bgmAudio.play().catch(() => {});
      }
    } else if (!mute) {
      this.startBgm();
    }

    // Notify all UI subscribers
    this.subscribers.forEach((cb) => cb(this.bgmMuted));

    // Play click sound feedback (sound effects always work)
    this.playClick();

    return this.bgmMuted;
  }

  subscribe(callback: (muted: boolean) => void): () => void {
    this.subscribers.add(callback);
    callback(this.bgmMuted);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // --- Sound Effects (SFX are completely independent from BGM Mute) ---

  playClick() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {
      console.warn("Audio Context Click failed:", e);
    }
  }

  playSuccess() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.15, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.25);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.25);
      });
    } catch (e) {
      console.warn("Audio Context Success failed:", e);
    }
  }

  playBeepSuccess() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {}
  }

  playError() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn("Audio Context Error failed:", e);
    }
  }

  playSlide() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = "sine";
      osc.frequency.setValueAtTime(300, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch (e) {}
  }

  playLevelComplete() {
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Arpeggio leading to a triumphant chord
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.12, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.08 + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch (e) {}
  }
}

export const audio = new AudioEngine();
export default audio;

/**
 * Custom React hook for subscribing to audio mute state changes.
 */
export function useAudioMute() {
  const [isMuted, setIsMuted] = useState<boolean>(() => audio.getMuted());

  useEffect(() => {
    return audio.subscribe((muted) => {
      setIsMuted(muted);
    });
  }, []);

  return {
    isMuted,
    toggleMute: () => audio.toggleMute(),
    setMute: (mute: boolean) => audio.setMute(mute),
  };
}

