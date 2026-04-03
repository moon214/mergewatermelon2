/**
 * 水果类
 */

// 水果配置
const FRUIT_CONFIG = [
  { name: '樱桃', score: 10, radius: 25, color: '#FF6B6B' },
  { name: '草莓', score: 20, radius: 32, color: '#FF8E8E' },
  { name: '橘子', score: 40, radius: 40, color: '#FFA726' },
  { name: '柠檬', score: 80, radius: 50, color: '#FFD54F' },
  { name: '猕猴桃', score: 160, radius: 62, color: '#8BC34A' },
  { name: '西红柿', score: 320, radius: 75, color: '#E53935' },
  { name: '桃子', score: 640, radius: 90, color: '#F48FB1' },
  { name: '西瓜', score: 1280, radius: 110, color: '#2E7D32' },
];

export default class Fruit {
  constructor(type, x, y) {
    this.type = type; // 0-7
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.isReleased = false;
    this.isMerged = false;
    this.isStable = false; // 是否已稳定
    
    const config = FRUIT_CONFIG[type];
    this.radius = config.radius;
    this.score = config.score;
    this.color = config.color;
  }

  // 更新物理
  update(deltaTime, gravity = 1500) {
    if (!this.isReleased) return;
    
    // 重力加速度（增加 3 倍）
    this.vy += gravity * (deltaTime / 1000);
    
    // 更新位置
    this.y += this.vy * (deltaTime / 1000);
    this.x += this.vx * (deltaTime / 1000);
    
    // 阻尼
    this.vx *= 0.95;
    this.vy *= 0.95;
    
    // 检查是否稳定
    if (Math.abs(this.vy) < 50 && Math.abs(this.vx) < 50) {
      this.isStable = true;
    }
  }

  // 渲染
  render(ctx, image = null) {
    if (image) {
      // 使用图片渲染 - 统一按半径的 2 倍尺寸渲染
      const size = this.radius * 2;
      ctx.drawImage(
        image,
        this.x - this.radius,
        this.y - this.radius,
        size,
        size
      );
    } else {
      // 使用颜色渲染（备用）
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      
      // 绘制高光
      ctx.beginPath();
      ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.closePath();
    }
  }

  // 检查碰撞
  checkCollision(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + other.radius);
  }

  // 获取配置
  static getConfig(type) {
    return FRUIT_CONFIG[type] || FRUIT_CONFIG[0];
  }

  // 获取所有配置
  static getAllConfig() {
    return FRUIT_CONFIG;
  }
}
