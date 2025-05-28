export class AudioPlayer {
  private audio: HTMLAudioElement | null = null;
  private isPlaying = false;
  private onEndCallbacks: (() => void)[] = [];

  async playAudioFromUrl(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing audio
        this.stop();

        this.audio = new Audio(url);
        this.audio.addEventListener("ended", () => {
          this.isPlaying = false;
          this.onEndCallbacks.forEach((callback) => callback());
          resolve();
        });

        this.audio.addEventListener("error", (error) => {
          this.isPlaying = false;
          reject(error);
        });

        this.isPlaying = true;
        this.audio.play().catch(reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async playAudioFromBlob(blob: Blob): Promise<void> {
    const url = URL.createObjectURL(blob);
    try {
      await this.playAudioFromUrl(url);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async playAudioFromArrayBuffer(buffer: ArrayBuffer): Promise<void> {
    const blob = new Blob([buffer], { type: "audio/mpeg" });
    return this.playAudioFromBlob(blob);
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
    }
  }

  pause(): void {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
      this.isPlaying = false;
    }
  }

  resume(): void {
    if (this.audio && !this.isPlaying) {
      this.audio.play();
      this.isPlaying = true;
    }
  }

  setVolume(volume: number): void {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  onEnd(callback: () => void): void {
    this.onEndCallbacks.push(callback);
  }

  removeOnEndCallback(callback: () => void): void {
    this.onEndCallbacks = this.onEndCallbacks.filter((cb) => cb !== callback);
  }
}
