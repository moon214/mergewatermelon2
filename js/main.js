/**
 * 游戏主逻辑
 */

import Fruit from './fruit.js';
import FruitManager from './fruitManager.js';
import Score from './score.js';
import Ad from './ad.js';
import Audio from './audio.js';

export default class Game {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    
    this.fruitManager = null;
    this.score = null;
    this.ad = null;
    this.audio = null;
    
    this.isRunning = false;
    this.lastTime = 0;
  }

  start() {
    // 获取 Canvas
    this.canvas = tt.createCanvas();
    this.ctx = this.canvas.getContext('2d');
    
    // 设置 Canvas 尺寸
    const systemInfo = tt.getSystemInfoSync();
    this.width = systemInfo.windowWidth;
    this.height = systemInfo.windowHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    console.log(`Canvas 尺寸：${this.width} x ${this.height}`);
    
    // 初始化游戏系统
    this.audio = new Audio();
    this.score = new Score();
    this.fruitManager = new FruitManager(this.ctx, this.width, this.height, this.score);
    this.ad = new Ad();
    
    // 预加载音效
    this.audio.preload();
    
    // 绑定输入事件
    this.bindEvents();
    
    // 加载资源
    this.loadResources().then(() => {
      // 开始游戏循环
      this.isRunning = true;
      this.lastTime = Date.now();
      this.gameLoop();
      
      console.log('游戏启动成功！');
    });
  }

  async loadResources() {
    console.log('加载资源...');
    
    // 加载水果图片
    const fruitImages = [
      'images/fruit_01_cherry.png',
      'images/fruit_02_strawberry.png',
      'images/fruit_03_orange.png',
      'images/fruit_04_lemon.png',
      'images/fruit_05_kiwi.png',
      'images/fruit_06_tomato.png',
      'images/fruit_07_peach.png',
      'images/fruit_08_watermelon.png',
    ];
    
    const promises = fruitImages.map(path => {
      return new Promise((resolve, reject) => {
        const img = tt.createImage();
        img.src = path;
        img.onload = () => resolve(img);
        img.onerror = () => {
          console.warn(`图片加载失败：${path}`);
          resolve(null);
        };
      });
    });
    
    this.fruitImages = await Promise.all(promises);
    console.log('资源加载完成');
  }

  bindEvents() {
    let isTouching = false;
    let touchStartX = 0;
    let lastTouchX = 0;
    
    // 触摸开始
    tt.onTouchStart((e) => {
      if (!this.isRunning || this.fruitManager.isGameOver) return;
      
      const touch = e.touches[0];
      isTouching = true;
      touchStartX = touch.clientX;
      lastTouchX = touch.clientX;
      
      console.log('触摸开始:', touch.clientX);
    });
    
    // 触摸移动
    tt.onTouchMove((e) => {
      if (!this.isRunning || !isTouching || this.fruitManager.isGameOver) return;
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastTouchX;
      
      this.fruitManager.moveCurrentFruit(deltaX);
      lastTouchX = touch.clientX;
    });
    
    // 触摸结束
    tt.onTouchEnd((e) => {
      if (!this.isRunning || !isTouching || this.fruitManager.isGameOver) return;
      
      isTouching = false;
      console.log('触摸结束，释放水果');
      
      this.fruitManager.releaseCurrentFruit();
      if (this.audio) this.audio.play('drop');
    });
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    const now = Date.now();
    const deltaTime = now - this.lastTime;
    this.lastTime = now;
    
    // 清空画布
    this.ctx.fillStyle = '#FFF5E6';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 更新和渲染游戏
    const merged = this.fruitManager.update(deltaTime);
    if (merged && this.audio) {
      this.audio.play('merge');
    }
    this.fruitManager.render(this.ctx, this.fruitImages);
    this.score.render(this.ctx);
    
    // 检查游戏结束
    if (this.fruitManager.isGameOver) {
      this.gameOver();
      return;
    }
    
    // 下一帧
    requestAnimationFrame(() => this.gameLoop());
  }

  gameOver() {
    // 播放失败音效
    if (this.audio) this.audio.play('fail');
    
    this.isRunning = false;
    console.log('游戏结束！得分:', this.score.getScore());
    
    // 显示游戏结束界面
    this.showGameOverUI();
    
    // 保存最高分
    this.saveHighestScore();
    
    // 显示插屏广告
    this.ad.showInterstitialAd();
  }

  showGameOverUI() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // 半透明背景
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // 游戏结束文字
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('游戏结束', centerX, centerY - 60);
    
    // 得分
    this.ctx.font = '32px Arial';
    this.ctx.fillText(`得分：${this.score.getScore()}`, centerX, centerY);
    
    // 最高分
    const highestScore = tt.getStorageSync('highestScore') || 0;
    this.ctx.fillText(`最高分：${highestScore}`, centerX, centerY + 50);
    
    // 重新开始提示
    this.ctx.font = '24px Arial';
    this.ctx.fillStyle = '#FFD700';
    this.ctx.fillText('点击屏幕重新开始', centerX, centerY + 120);
    
    // 绑定重新开始事件
    const restartHandler = () => {
      tt.offTouchStart(restartHandler);
      this.restart();
    };
    tt.onTouchStart(restartHandler);
  }

  restart() {
    console.log('重新开始游戏');
    this.score.reset();
    this.fruitManager.reset();
    this.isRunning = true;
    this.lastTime = Date.now();
    this.gameLoop();
  }

  async saveHighestScore() {
    const currentScore = this.score.getScore();
    const highestScore = tt.getStorageSync('highestScore') || 0;
    
    if (currentScore > highestScore) {
      tt.setStorageSync('highestScore', currentScore);
      console.log('新纪录！', currentScore);
      
      // 保存到云存储
      try {
        await tt.cloudStorage.setUserCloudStorage({
          kvList: [{ key: 'highest_score', value: currentScore.toString() }],
        });
        console.log('云存储保存成功');
      } catch (err) {
        console.error('云存储失败:', err);
      }
    }
  }

  pause() {
    this.isRunning = false;
    if (this.audio) {
      this.audio.stopBGM();
    }
    console.log('游戏暂停');
  }

  destroy() {
    this.isRunning = false;
    if (this.audio) {
      this.audio.stopBGM();
    }
    this.fruitManager = null;
    this.score = null;
    this.ad = null;
    this.audio = null;
    console.log('游戏销毁');
  }
}
