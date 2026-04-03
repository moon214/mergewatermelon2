/**
 * 水果管理器
 */

import Fruit from './fruit.js';

export default class FruitManager {
  constructor(ctx, gameWidth, gameHeight, score) {
    this.ctx = ctx;
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.score = score;
    
    this.fruits = [];
    this.currentFruit = null;
    this.currentFruitType = 0;
    this.nextFruitType = 0;
    
    this.spawnY = gameHeight * 0.15;
    this.moveRange = gameWidth * 0.4;
    
    this.isGameOver = false;
    this.failHeight = gameHeight * 0.9;
    
    // 生成概率
    this.spawnProbabilities = [0.35, 0.25, 0.18, 0.12, 0.07, 0.03];
    
    // 初始化第一个水果
    this.spawnFirstFruit();
  }

  // 生成第一个水果
  spawnFirstFruit() {
    this.nextFruitType = this.getRandomFruitType();
    this.spawnFruit();
  }

  // 生成水果
  spawnFruit() {
    if (this.isGameOver) return;
    
    this.currentFruitType = this.nextFruitType;
    this.nextFruitType = this.getRandomFruitType();
    
    const config = Fruit.getConfig(this.currentFruitType);
    this.currentFruit = new Fruit(
      this.currentFruitType,
      this.gameWidth / 2,
      this.spawnY
    );
    
    console.log(`生成水果：${config.name}`);
  }

  // 移动当前水果
  moveCurrentFruit(deltaX) {
    if (!this.currentFruit || this.currentFruit.isReleased) return;
    
    let newX = this.currentFruit.x + deltaX;
    newX = Math.max(this.moveRange, Math.min(this.gameWidth - this.moveRange, newX));
    this.currentFruit.x = newX;
  }

  // 释放当前水果
  releaseCurrentFruit() {
    if (!this.currentFruit || this.isGameOver) return;
    
    this.currentFruit.isReleased = true;
    console.log('释放水果');
  }

  // 更新
  update(deltaTime) {
    if (this.isGameOver) return;
    
    // 更新所有水果
    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const fruit = this.fruits[i];
      fruit.update(deltaTime);
      
      // 边界检测
      this.checkBoundaries(fruit);
      
      // 检查是否稳定
      if (fruit.isReleased && Math.abs(fruit.vy) < 10) {
        fruit.vy = 0;
      }
    }
    
    // 检查合成
    this.checkMerges();
    
    // 检查游戏结束
    this.checkGameOver();
    
    // 检查是否需要生成新水果
    if (this.currentFruit && this.currentFruit.isReleased && 
        Math.abs(this.currentFruit.vy) < 10 && this.currentFruit.y > this.gameHeight * 0.5) {
      setTimeout(() => {
        if (!this.isGameOver && !this.currentFruit) {
          this.spawnFruit();
        }
      }, 1000);
      this.currentFruit = null;
    }
  }

  // 边界检测
  checkBoundaries(fruit) {
    const groundY = this.gameHeight - fruit.radius - 10;
    
    // 地面碰撞
    if (fruit.y > groundY) {
      fruit.y = groundY;
      fruit.vy = -fruit.vy * 0.3; // 反弹
    }
    
    // 墙壁碰撞
    if (fruit.x < fruit.radius) {
      fruit.x = fruit.radius;
      fruit.vx = -fruit.vx * 0.5;
    }
    if (fruit.x > this.gameWidth - fruit.radius) {
      fruit.x = this.gameWidth - fruit.radius;
      fruit.vx = -fruit.vx * 0.5;
    }
  }

  // 检查合成
  checkMerges() {
    for (let i = 0; i < this.fruits.length; i++) {
      for (let j = i + 1; j < this.fruits.length; j++) {
        const fruit1 = this.fruits[i];
        const fruit2 = this.fruits[j];
        
        if (fruit1.isMerged || fruit2.isMerged) continue;
        
        if (fruit1.checkCollision(fruit2) && fruit1.type === fruit2.type) {
          // 可以合成
          if (fruit1.type < 7) {
            this.mergeFruits(fruit1, fruit2);
          }
        }
      }
    }
  }

  // 合成水果
  mergeFruits(fruit1, fruit2) {
    console.log('合成水果！');
    
    // 标记为已合并
    fruit1.isMerged = true;
    fruit2.isMerged = true;
    
    // 计算合成位置
    const mergeX = (fruit1.x + fruit2.x) / 2;
    const mergeY = (fruit1.y + fruit2.y) / 2;
    
    // 移除旧水果
    this.fruits = this.fruits.filter(f => f !== fruit1 && f !== fruit2);
    
    // 生成新水果
    const newType = fruit1.type + 1;
    const newFruit = new Fruit(newType, mergeX, mergeY);
    newFruit.isReleased = true;
    this.fruits.push(newFruit);
    
    // 加分
    const config = Fruit.getConfig(newType);
    this.score.addScore(config.score);
    
    console.log(`合成：${Fruit.getConfig(fruit1.type).name} → ${config.name}`);
  }

  // 检查游戏结束
  checkGameOver() {
    for (const fruit of this.fruits) {
      if (!fruit.isMerged && fruit.y < this.failHeight && Math.abs(fruit.vy) < 10) {
        // 有水果堆积过高
        this.isGameOver = true;
        console.log('游戏结束！');
        break;
      }
    }
  }

  // 渲染
  render(ctx, images) {
    // 渲染所有水果
    for (const fruit of this.fruits) {
      if (!fruit.isMerged) {
        const image = images[fruit.type];
        fruit.render(ctx, image);
      }
    }
    
    // 渲染当前水果
    if (this.currentFruit && !this.currentFruit.isReleased) {
      const image = images[this.currentFruit.type];
      this.currentFruit.render(ctx, image);
    }
    
    // 渲染生成线
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, this.failHeight);
    ctx.lineTo(this.gameWidth, this.failHeight);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // 获取随机水果类型
  getRandomFruitType() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (let i = 0; i < this.spawnProbabilities.length; i++) {
      cumulative += this.spawnProbabilities[i];
      if (rand < cumulative) {
        return i;
      }
    }
    
    return 0;
  }

  // 重置
  reset() {
    this.fruits = [];
    this.currentFruit = null;
    this.isGameOver = false;
    this.spawnFirstFruit();
  }
}
