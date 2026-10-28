/**
 * Sound effects disabled as requested by user.
 * Kept as no-ops to guarantee zero sound playback across all interactions.
 */

class SoundSystem {
  public setMuted(_muted: boolean) {}
  public getMuted() { return true; }
  public playPageFlip() {}
  public playCoverOpen() {}
  public playGlassChime() {}
  public toggleAmbientLounge(): boolean { return false; }
  public getIsAmbientPlaying() { return false; }
}

export const sound = new SoundSystem();
