/**
 * 水果类 - 带物理引擎
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
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;      // 旋转角度（弧度）
    this.angularVel = 0; // 角速度
    this.isReleased = false;
    this.isMerged = false;
    this.isStable = false;
    
    const config = FRUIT_CONFIG[type];
    this.radius = config.radius;
    this.score = config.score;
    this.color = config.color;
    
    // 物理属性
    this.mass = config.radius * 0.5; // 质量与半径成正比
    this.restitution = 0.3; // 弹性系数
    this.friction = 0.8;    // 摩擦系数
  }

  // 更新物理
  update(deltaTime, gravity = 1125) {
    if (!this.isReleased) return;
    
    // 重力加速度（减缓到 1125）
    this.vy += gravity * (deltaTime / 1000);
    
    // 更新位置
    this.y += this.vy * (deltaTime / 1000);
    this.x += this.vx * (deltaTime / 1000);
    
    // 更新旋转
    this.angle += this.angularVel * (deltaTime / 1000);
    
    // 阻尼（线性和角阻尼）
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.angularVel *= 0.9;
    
    // 检查是否稳定
    if (Math.abs(this.vy) < 50 && Math.abs(this.vx) < 50 && Math.abs(this.angularVel) < 0.1) {
      this.isStable = true;
    }
  }

  // 施加冲击力（碰撞时）
  applyImpulse(impulseX, impulseY, contactX, contactY) {
    // 计算力矩
    const dx = contactX - this.x;
    const dy = contactY - this.y;
    
    // 冲量产生的角速度
    const torque = dx * impulseY - dy * impulseX;
    this.angularVel += torque * 0.001 / this.mass;
    
    // 线性冲量
    this.vx += impulseX / this.mass;
    this.vy += impulseY / this.mass;
    
    this.isStable = false;
  }

  // 渲染
  render(ctx, image = null) {
    ctx.save();
    
    // 移动到水果中心并旋转
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    if (image) {
      // 使用图片渲染 - 按图片实际形状（不裁剪）
      // 图片本身有白色边框和卡通轮廓，直接绘制即可
      const size = this.radius * 2;
      
      // 直接绘制图片，保留原始形状（包括白色边框）
      ctx.drawImage(
        image,
        -this.radius,
        -this.radius,
        size,
        size
      );
    } else {
      // 使用颜色渲染（备用）
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
      
      // 绘制高光（随旋转转动）
      ctx.beginPath();
      ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
      ctx.closePath();
    }
    
    ctx.restore();
  }

  // 检查碰撞
  checkCollision(other) {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (this.radius + other.radius);
  }

  // 处理碰撞响应
  resolveCollision(other) {
    if (!this.isReleased || !other.isReleased) return;
    
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return; // 避免除零
    
    // 法向量
    const nx = dx / distance;
    const ny = dy / distance;
    
    // 相对速度
    const dvx = this.vx - other.vx;
    const dvy = this.vy - other.vy;
    
    // 法向相对速度
    const dvn = dvx * nx + dvy * ny;
    
    // 只有接近时才响应
    if (dvn > 0) return;
    
    // 冲量大小
    const restitution = Math.min(this.restitution, other.restitution);
    const impulse = -(1 + restitution) * dvn / (1 / this.mass + 1 / other.mass);
    
    // 应用冲量
    const impulseX = impulse * nx;
    const impulseY = impulse * ny;
    
    this.vx += impulseX / this.mass;
    this.vy += impulseY / this.mass;
    other.vx -= impulseX / other.mass;
    other.vy -= impulseY / other.mass;
    
    // 应用旋转
    this.applyImpulse(impulseX, impulseY, this.x + nx * this.radius, this.y + ny * this.radius);
    other.applyImpulse(-impulseX, -impulseY, other.x - nx * other.radius, other.y - ny * other.radius);
  }

  // 获取配置
  static getConfig(type) {
    return FRUIT_CONFIG[type] || FRUIT_CONFIG[0];
  }
}
