import { _decorator, Component, AudioClip, AudioSource, resources } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 音频管理器
 */
@ccclass('AudioManager')
export class AudioManager extends Component {
    @property(AudioClip)
    bgmClip: AudioClip = null!;

    @property(AudioClip)
    dropSFX: AudioClip = null!;

    @property(AudioClip)
    mergeSFX: AudioClip = null!;

    @property(AudioClip)
    comboSFX: AudioClip = null!;

    @property(AudioClip)
    failSFX: AudioClip = null!;

    private bgmSource: AudioSource = null!;
    private sfxSource: AudioSource = null!;
    private isBGMPlaying: boolean = false;

    onLoad() {
        this.bgmSource = this.addComponent(AudioSource);
        this.sfxSource = this.addComponent(AudioSource);
        this.bgmSource.loop = true;
    }

    public playBGM() {
        if (this.bgmClip && !this.isBGMPlaying) {
            if (this.bgmSource.clip !== this.bgmClip) {
                this.bgmSource.clip = this.bgmClip;
            }
            this.bgmSource.play();
            this.isBGMPlaying = true;
            console.log('[AudioManager] 播放 BGM');
        }
    }

    public stopBGM() {
        if (this.isBGMPlaying) {
            this.bgmSource.stop();
            this.isBGMPlaying = false;
            console.log('[AudioManager] 停止 BGM');
        }
    }

    public playSFX(type: string) {
        let clip: AudioClip | null = null;

        switch (type) {
            case 'drop':
                clip = this.dropSFX;
                break;
            case 'merge':
                clip = this.mergeSFX;
                break;
            case 'combo':
                clip = this.comboSFX;
                break;
            case 'fail':
                clip = this.failSFX;
                break;
        }

        if (clip) {
            this.sfxSource.playOneShot(clip, 1.0);
            console.log(`[AudioManager] 播放音效：${type}`);
        }
    }

    public setVolume(bgmVolume: number = 0.5, sfxVolume: number = 0.8) {
        this.bgmSource.volume = bgmVolume;
        this.sfxSource.volume = sfxVolume;
    }

    public pauseAll() {
        this.bgmSource.pause();
        this.sfxSource.pause();
    }

    public resumeAll() {
        if (this.isBGMPlaying) {
            this.bgmSource.play();
        }
        this.sfxSource.play();
    }
}
