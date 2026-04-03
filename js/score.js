/**
 * 分数系统
 */

export default class Score {
  constructor() {
    this.currentScore = 0;
    this.highestScore = tt.getStorageSync('highestScore') || 0;
    this.comboCount = 0;
    this.lastMergeTime = 0;
  }

  // 加分
  addScore(baseScore) {
    // 检查连击
    const now = Date.now();
    const isCombo = now - this.lastMergeTime < 2000;
    
    if (isCombo) {
      this.comboCount++;
    } else {
      this.comboCount = 0;
    }
    
    this.lastMergeTime = now;
    
    // 计算倍率
    const multiplier = this.getComboMultiplier();
    const finalScore = Math.floor(baseScore * multiplier);
    
    this.currentScore += finalScore;
    
    console.log(`加分：${baseScore} x ${multiplier} = ${finalScore} (连击 x${this.comboCount})`);
    
    // 检查新纪录
    if (this.currentScore > this.highestScore) {
      this.highestScore = this.currentScore;
      tt.setStorageSync('highestScore', this.highestScore);
      console.log('新纪录！', this.highestScore);
    }
  }

  // 获取连击倍率
  getComboMultiplier() {
    if (this.comboCount >= 10) return 3.0;
    if (this.comboCount >= 6) return 2.0;
    if (this.comboCount >= 4) return 1.5;
    if (this.comboCount >= 2) return 1.2;
    return 1.0;
  }

  // 获取当前分数
  getScore() {
    return this.currentScore;
  }

  // 获取最高分
  getHighestScore() {
    return this.highestScore;
  }

  // 重置
  reset() {
    this.currentScore = 0;
    this.comboCount = 0;
    this.lastMergeTime = 0;
  }

  // 渲染
  render(ctx) {
    const width = ctx.canvas.width;
    
    // 当前分数（向下移动，避开灵动岛）
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`得分：${this.currentScore}`, 20, 70);
    
    // 最高分
    ctx.textAlign = 'center';
    ctx.fillText(`最高：${this.highestScore}`, width / 2, 70);
    
    // 连击提示
    if (this.comboCount >= 2) {
      ctx.fillStyle = '#FF6B6B';
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(`${this.comboCount}连击!`, width - 20, 45);
    }
  }
}
