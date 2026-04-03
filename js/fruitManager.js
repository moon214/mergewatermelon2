/**
 * 水果管理器 - 带物理引擎
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
    
    // 生成位置（屏幕顶部 1/5 处）
    this.spawnY = this.gameHeight * 0.15;
    // 移动范围（左右各留 15%）
    this.minX = this.gameWidth * 0.15;
    this.maxX = this.gameWidth * 0.85;
    
    this.isGameOver = false;
    this.failHeight = this.gameHeight * 0.85;
    
    // 生成概率
    this.spawnProbabilities = [0.35, 0.25, 0.18, 0.12, 0.07, 0.03];
    
    // 标记是否正在等待生成新水果
    this.waitingForNextSpawn = false;
    
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
    
    this.waitingForNextSpawn = false;
    console.log(`生成水果：${config.name}`);
  }

  // 移动当前水果
  moveCurrentFruit(deltaX) {
    if (!this.currentFruit || this.currentFruit.isReleased) return;
    
    let newX = this.currentFruit.x + deltaX;
    newX = Math.max(this.minX, Math.min(this.maxX, newX));
    this.currentFruit.x = newX;
  }

  // 释放当前水果（下落）
  releaseCurrentFruit() {
    if (!this.currentFruit || this.isGameOver) return;
    
    this.currentFruit.isReleased = true;
    this.fruits.push(this.currentFruit);
    
    console.log('释放水果，开始下落');
    
    // 设置延迟生成新水果
    this.waitingForNextSpawn = true;
    setTimeout(() => {
      if (!this.isGameOver && this.waitingForNextSpawn) {
        this.spawnFruit();
      }
    }, 800);
  }

  // 更新
  update(deltaTime) {
    if (this.isGameOver) return;
    
    let hasMerged = false;
    
    // 更新所有已释放的水果
    for (let i = this.fruits.length - 1; i >= 0; i--) {
      const fruit = this.fruits[i];
      if (!fruit.isMerged) {
        fruit.update(deltaTime, 1125); // 重力减缓到 1125
        
        // 边界检测
        this.checkBoundaries(fruit);
      }
    }
    
    // 检查碰撞响应（物理引擎核心）
    this.resolveCollisions();
    
    // 检查合成
    hasMerged = this.checkMerges();
    
    // 检查游戏结束
    this.checkGameOver();
    
    return hasMerged;
  }

  // 边界检测
  checkBoundaries(fruit) {
    const groundY = this.gameHeight - fruit.radius - 10;
    
    // 地面碰撞
    if (fruit.y > groundY) {
      fruit.y = groundY;
      fruit.vy = -fruit.vy * fruit.restitution; // 反弹
      
      // 地面摩擦
      fruit.vx *= fruit.friction;
      fruit.angularVel *= 0.8;
      
      // 如果速度很小，直接停止
      if (Math.abs(fruit.vy) < 50 && Math.abs(fruit.vx) < 50) {
        fruit.vy = 0;
        fruit.vx = 0;
        fruit.angularVel = 0;
        fruit.isStable = true;
      }
    }
    
    // 左墙碰撞
    if (fruit.x < fruit.radius + 5) {
      fruit.x = fruit.radius + 5;
      fruit.vx = -fruit.vx * fruit.restitution;
      fruit.angularVel += fruit.vy * 0.01; // 碰撞产生旋转
    }
    
    // 右墙碰撞
    if (fruit.x > this.gameWidth - fruit.radius - 5) {
      fruit.x = this.gameWidth - fruit.radius - 5;
      fruit.vx = -fruit.vx * fruit.restitution;
      fruit.angularVel -= fruit.vy * 0.01;
    }
  }

  // 检查所有水果之间的碰撞响应
  resolveCollisions() {
    for (let i = 0; i < this.fruits.length; i++) {
      for (let j = i + 1; j < this.fruits.length; j++) {
        const fruit1 = this.fruits[i];
        const fruit2 = this.fruits[j];
        
        if (fruit1.isMerged || fruit2.isMerged) continue;
        
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = fruit1.radius + fruit2.radius;
        
        // 检查碰撞
        if (distance < minDistance) {
          // 分离水果（避免重叠）
          const overlap = minDistance - distance;
          const nx = dx / distance;
          const ny = dy / distance;
          
          fruit1.x -= overlap * 0.5 * nx;
          fruit1.y -= overlap * 0.5 * ny;
          fruit2.x += overlap * 0.5 * nx;
          fruit2.y += overlap * 0.5 * ny;
          
          // 物理碰撞响应
          fruit1.resolveCollision(fruit2);
        }
      }
    }
  }

  // 检查合成
  checkMerges() {
    let hasMerged = false;
    
    for (let i = 0; i < this.fruits.length; i++) {
      for (let j = i + 1; j < this.fruits.length; j++) {
        const fruit1 = this.fruits[i];
        const fruit2 = this.fruits[j];
        
        if (fruit1.isMerged || fruit2.isMerged) continue;
        
        const dx = fruit2.x - fruit1.x;
        const dy = fruit2.y - fruit1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const minDistance = fruit1.radius + fruit2.radius;
        
        // 距离小于半径和的 90% 且类型相同则合成
        if (distance < minDistance * 0.9 && fruit1.type === fruit2.type) {
          if (fruit1.type < 7) {
            this.mergeFruits(fruit1, fruit2, i, j);
            hasMerged = true;
          }
        }
      }
    }
    
    return hasMerged;
  }

  // 合成水果
  mergeFruits(fruit1, fruit2, idx1, idx2) {
    console.log('合成水果！');
    
    fruit1.isMerged = true;
    fruit2.isMerged = true;
    
    this.fruits.splice(idx2, 1);
    this.fruits.splice(idx1, 1);
    
    const mergeX = (fruit1.x + fruit2.x) / 2;
    const mergeY = (fruit1.y + fruit2.y) / 2;
    
    const newType = fruit1.type + 1;
    const newFruit = new Fruit(newType, mergeX, mergeY);
    newFruit.isReleased = true;
    this.fruits.push(newFruit);
    
    const config = Fruit.getConfig(newType);
    this.score.addScore(config.score);
    
    console.log(`合成：${Fruit.getConfig(fruit1.type).name} → ${config.name}`);
  }

  // 检查游戏结束
  checkGameOver() {
    const stableHighFruits = this.fruits.filter(fruit => 
      !fruit.isMerged && 
      fruit.isStable &&
      fruit.y < this.failHeight
    );
    
    if (stableHighFruits.length >= 3) {
      this.isGameOver = true;
      console.log('游戏结束！');
    }
  }

  // 渲染 - 按 y 坐标排序（远的先画，近的后画）
  render(ctx, images) {
    // 绘制失败线
    ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
    ctx.setLineDash([10, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(10, this.failHeight);
    ctx.lineTo(this.gameWidth - 10, this.failHeight);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineWidth = 1;
    
    // 按 y 坐标排序（y 大的在后，避免遮挡）
    const renderList = [...this.fruits].filter(f => !f.isMerged);
    renderList.sort((a, b) => a.y - b.y);
    
    // 渲染所有水果
    for (const fruit of renderList) {
      const image = images[fruit.type];
      fruit.render(ctx, image);
    }
    
    // 渲染当前水果
    if (this.currentFruit && !this.currentFruit.isReleased) {
      const image = images[this.currentFruit.type];
      this.currentFruit.render(ctx, image);
    }
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

  // 重置游戏
  reset() {
    this.fruits = [];
    this.currentFruit = null;
    this.isGameOver = false;
    this.waitingForNextSpawn = false;
    this.spawnFirstFruit();
  }
}
