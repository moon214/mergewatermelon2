/**
 * 水果类 - 2D 增强版（带 3D 视觉效果）
 */

// 水果配置
const FRUIT_CONFIG = [
  { name: '樱桃', score: 10, radius: 25, color: '#FF6B6B', gradient: ['#FF8E8E', '#FF6B6B', '#CC5555'] },
  { name: '草莓', score: 20, radius: 32, color: '#FF8E8E', gradient: ['#FFB5B5', '#FF8E8E', '#CC7272'] },
  { name: '橘子', score: 40, radius: 40, color: '#FFA726', gradient: ['#FFCC80', '#FFA726', '#CC841F'] },
  { name: '柠檬', score: 80, radius: 50, color: '#FFD54F', gradient: ['#FFF176', '#FFD54F', '#CCA93F'] },
  { name: '猕猴桃', score: 160, radius: 62, color: '#8BC34A', gradient: ['#AED581', '#8BC34A', '#6F9E3B'] },
  { name: '西红柿', score: 320, radius: 75, color: '#E53935', gradient: ['#E57373', '#E53935', '#B72D2B'] },
  { name: '桃子', score: 640, radius: 90, color: '#F48FB1', gradient: ['#F8BBD9', '#F48FB1', '#C3728E'] },
  { name: '西瓜', score: 1280, radius: 110, color: '#2E7D32', gradient: ['#66BB6A', '#2E7D32', '#256628'] },
];

export default class Fruit {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.angle = 0;
    this.angularVel = 0;
    this.isReleased = false;
    this.isMerged = false;
    this.isStable = false;
    
    // 挤压变形动画
    this.scaleX = 1;
    this.scaleY = 1;
    this.isSquashing = false;
    
    const config = FRUIT_CONFIG[type];
    this.radius = config.radius;
    this.score = config.score;
    this.color = config.color;
    this.gradient = config.gradient;
    
    // 物理属性
    this.mass = config.radius * 0.5;
    this.restitution = 0.3;
    this.friction = 0.8;
  }

  // 更新物理
  update(deltaTime, gravity = 1125) {
    if (!this.isReleased) return;
    
    // 重力
    this.vy += gravity * (deltaTime / 1000);
    
    // 位置
    this.y += this.vy * (deltaTime / 1000);
    this.x += this.vx * (deltaTime / 1000);
    
    // 旋转
    this.angle += this.angularVel * (deltaTime / 1000);
    
    // 阻尼
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.angularVel *= 0.9;
    
    // 挤压变形恢复
    if (this.isSquashing) {
      this.scaleX += (1 - this.scaleX) * 0.1;
      this.scaleY += (1 - this.scaleY) * 0.1;
      
      // 接近 1 时停止
      if (Math.abs(this.scaleX - 1) < 0.01 && Math.abs(this.scaleY - 1) < 0.01) {
        this.scaleX = 1;
        this.scaleY = 1;
        this.isSquashing = false;
      }
    }
    
    // 稳定检测
    if (Math.abs(this.vy) < 50 && Math.abs(this.vx) < 50 && Math.abs(this.angularVel) < 0.1) {
      this.isStable = true;
    }
  }

  // 挤压效果（碰撞时触发）
  squash(amount) {
    this.isSquashing = true;
    this.scaleX = 1 + amount;
    this.scaleY = 1 - amount;
  }

  // 施加冲击力
  applyImpulse(impulseX, impulseY, contactX, contactY) {
    const dx = contactX - this.x;
    const dy = contactY - this.y;
    const torque = dx * impulseY - dy * impulseX;
    this.angularVel += torque * 0.001 / this.mass;
    this.vx += impulseX / this.mass;
    this.vy += impulseY / this.mass;
    this.isStable = false;
    
    // 撞击时触发挤压
    const impact = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
    if (impact > 100) {
      this.squash(Math.min(impact / 500, 0.3));
    }
  }

  // 渲染 - 2D 增强版（带 3D 效果）
  render(ctx, image = null) {
    ctx.save();
    
    // 移动到水果中心
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // 应用挤压变形
    ctx.scale(this.scaleX, this.scaleY);
    
    if (image) {
      // 使用图片渲染 - 圆形裁剪
      const size = this.radius * 2;
      
      // 创建圆形裁剪路径
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      
      // 绘制图片
      ctx.drawImage(image, -this.radius, -this.radius, size, size);
    } else {
      // 使用渐变渲染（3D 效果）
      const gradient = ctx.createRadialGradient(
        -this.radius * 0.3, -this.radius * 0.3, 0,
        0, 0, this.radius
      );
      gradient.addColorStop(0, this.gradient[0]);
      gradient.addColorStop(0.5, this.gradient[1]);
      gradient.addColorStop(1, this.gradient[2]);
      
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.closePath();
      
      // 高光（增强 3D 感）
      ctx.beginPath();
      ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
      ctx.closePath();
      
      // 边缘阴影（增强立体感）
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.closePath();
    }
    
    ctx.restore();
    
    // 绘制阴影（在地面上）
    if (this.isReleased && !this.isMerged) {
      const shadowY = ctx.canvas.height - 10;
      const distanceToGround = shadowY - this.y;
      
      if (distanceToGround < 200) {
        const shadowSize = this.radius * (1 + distanceToGround / 500);
        const shadowAlpha = Math.max(0, 0.3 - distanceToGround / 600);
        
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(this.x, shadowY, shadowSize, shadowSize * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      }
    }
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
    
    if (distance === 0) return;
    
    const nx = dx / distance;
    const ny = dy / distance;
    
    const dvx = this.vx - other.vx;
    const dvy = this.vy - other.vy;
    const dvn = dvx * nx + dvy * ny;
    
    if (dvn > 0) return;
    
    const restitution = Math.min(this.restitution, other.restitution);
    const impulse = -(1 + restitution) * dvn / (1 / this.mass + 1 / other.mass);
    
    const impulseX = impulse * nx;
    const impulseY = impulse * ny;
    
    this.vx += impulseX / this.mass;
    this.vy += impulseY / this.mass;
    other.vx -= impulseX / other.mass;
    other.vy -= impulseY / other.mass;
    
    this.applyImpulse(impulseX, impulseY, this.x + nx * this.radius, this.y + ny * this.radius);
    other.applyImpulse(-impulseX, -impulseY, other.x - nx * other.radius, other.y - ny * other.radius);
  }

  // 获取配置
  static getConfig(type) {
    return FRUIT_CONFIG[type] || FRUIT_CONFIG[0];
  }
}
