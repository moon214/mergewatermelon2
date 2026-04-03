/**
 * 音效系统
 */

export default class Audio {
  constructor() {
    this.bgm = null;
    this.sfx = {};
    this.isMuted = false;
    this.bgmVolume = 0.5;
    this.sfxVolume = 0.8;
  }

  // 预加载音效
  async preload() {
    console.log('预加载音效...');
    
    const sfxList = {
      drop: 'audio/sfx/drop.ogg',
      merge: 'audio/sfx/merge.ogg',
      combo: 'audio/sfx/combo.mp3',
      fail: 'audio/sfx/fail.mp3',
    };

    for (const [name, path] of Object.entries(sfxList)) {
      try {
        const audio = tt.createInnerAudioContext();
        audio.src = path;
        audio.volume = this.sfxVolume;
        audio.obeyMuteSwitch = false; // 不受静音开关影响
        
        // 监听加载完成
        audio.onCanplay(() => {
          console.log(`音效加载成功：${name}`);
        });
        
        audio.onError((err) => {
          console.warn(`音效加载失败：${name}`, err);
        });
        
        this.sfx[name] = audio;
      } catch (err) {
        console.warn(`音效初始化失败：${name}`, err);
      }
    }

    console.log('音效预加载完成');
  }

  // 播放音效
  play(name) {
    if (this.isMuted) return;
    
    const audio = this.sfx[name];
    if (audio && audio.src) {
      try {
        // 停止当前播放
        audio.stop();
        audio.seek(0);
        audio.play();
      } catch (err) {
        console.warn(`音效播放失败：${name}`, err);
      }
    }
  }

  // 播放背景音乐
  playBGM(path) {
    if (this.isMuted) return;

    if (this.bgm) {
      this.bgm.stop();
    }

    this.bgm = tt.createInnerAudioContext();
    this.bgm.src = path;
    this.bgm.loop = true;
    this.bgm.volume = this.bgmVolume;
    this.bgm.play();
  }

  // 停止 BGM
  stopBGM() {
    if (this.bgm) {
      this.bgm.stop();
      this.bgm = null;
    }
  }

  // 静音切换
  toggleMute() {
    this.isMuted = !this.isMuted;
    
    if (this.isMuted) {
      if (this.bgm) this.bgm.pause();
    } else {
      if (this.bgm) this.bgm.resume();
    }
    
    return this.isMuted;
  }

  // 设置音量
  setVolume(bgm = 0.5, sfx = 0.8) {
    this.bgmVolume = bgm;
    this.sfxVolume = sfx;
    
    if (this.bgm) this.bgm.volume = bgm;
    for (const audio of Object.values(this.sfx)) {
      audio.volume = sfx;
    }
  }
}
