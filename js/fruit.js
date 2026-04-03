/**
 * 水果类 - Canvas 绘制版（无白色背景）
 */

// 水果配置 - 使用 Canvas 绘制颜色，不用图片
const FRUIT_CONFIG = [
  { 
    name: '樱桃', 
    score: 10, 
    radius: 25, 
    color: '#FF6B6B',
    gradient: ['#FF8E8E', '#FF6B6B', '#CC5555'],
    features: { stem: true, leaf: true } // 有茎和叶子
  },
  { 
    name: '草莓', 
    score: 20, 
    radius: 32, 
    color: '#FF8E8E',
    gradient: ['#FFB5B5', '#FF8E8E', '#CC7272'],
    features: { seeds: true, leaf: true } // 有籽和叶子
  },
  { 
    name: '橘子', 
    score: 40, 
    radius: 40, 
    color: '#FFA726',
    gradient: ['#FFCC80', '#FFA726', '#CC841F'],
    features: { segments: true } // 有瓣
  },
  { 
    name: '柠檬', 
    score: 80, 
    radius: 50, 
    color: '#FFD54F',
    gradient: ['#FFF176', '#FFD54F', '#CCA93F'],
    features: { oval: true } // 椭圆形
  },
  { 
    name: '猕猴桃', 
    score: 160, 
    radius: 62, 
    color: '#8BC34A',
    gradient: ['#AED581', '#8BC34A', '#6F9E3B'],
    features: { seeds: true, brown: true } // 有籽，棕色
  },
  { 
    name: '西红柿', 
    score: 320, 
    radius: 75, 
    color: '#E53935',
    gradient: ['#E57373', '#E53935', '#B72D2B'],
    features: { smooth: true } // 光滑
  },
  { 
    name: '桃子', 
    score: 640, 
    radius: 90, 
    color: '#F48FB1',
    gradient: ['#F8BBD9', '#F48FB1', '#C3728E'],
    features: { pink: true, point: true } // 粉色，尖头
  },
  { 
    name: '西瓜', 
    score: 1280, 
    radius: 110, 
    color: '#2E7D32',
    gradient: ['#66BB6A', '#2E7D32', '#256628'],
    features: { stripes: true, seeds: true } // 有条纹和籽
  },
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
    this.features = config.features;
    
    // 物理属性
    this.mass = config.radius * 0.5;
    this.restitution = 0.4; // 增加弹性
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
    this.angularVel *= 0.85;
    
    // 挤压变形恢复
    if (this.isSquashing) {
      this.scaleX += (1 - this.scaleX) * 0.08;
      this.scaleY += (1 - this.scaleY) * 0.08;
      
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

  // 挤压效果
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
    
    // 撞击时触发挤压（更敏感）
    const impact = Math.sqrt(impulseX * impulseX + impulseY * impulseY);
    if (impact > 30) { // 降低阈值
      this.squash(Math.min(impact / 250, 0.5));
    }
  }

  // 渲染 - Canvas 绘制（无白色背景）
  render(ctx) {
    ctx.save();
    
    // 移动到水果中心
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    
    // 应用挤压变形
    ctx.scale(this.scaleX, this.scaleY);
    
    // 绘制水果主体（径向渐变）
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
    
    // 绘制水果特征
    this.drawFeatures(ctx);
    
    // 边缘阴影
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
    
    ctx.restore();
    
    // 绘制地面阴影
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

  // 绘制水果特征
  drawFeatures(ctx) {
    const r = this.radius;
    
    // 樱桃：茎和叶子
    if (this.features.stem) {
      ctx.beginPath();
      ctx.moveTo(0, -r * 0.8);
      ctx.quadraticCurveTo(r * 0.3, -r * 1.2, r * 0.5, -r * 1.3);
      ctx.strokeStyle = '#4CAF50';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // 叶子
      ctx.beginPath();
      ctx.ellipse(r * 0.5, -r * 1.3, r * 0.15, r * 0.08, Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = '#4CAF50';
      ctx.fill();
    }
    
    // 草莓：籽
    if (this.features.seeds && !this.features.brown) {
      ctx.fillStyle = '#FFEB3B';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * r * 0.6;
        const y = Math.sin(angle) * r * 0.6;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 猕猴桃：棕色外皮 + 籽
    if (this.features.brown) {
      // 棕色外圈
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.95, 0, Math.PI * 2);
      ctx.fillStyle = '#8D6E63';
      ctx.fill();
      
      // 黑色籽
      ctx.fillStyle = '#3E2723';
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const dist = r * 0.5;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.arc(x, y, r * 0.04, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 西瓜：条纹
    if (this.features.stripes) {
      ctx.strokeStyle = '#1B5E20';
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        const x = -r * 0.6 + i * r * 0.3;
        ctx.beginPath();
        ctx.moveTo(x, -r * 0.8);
        ctx.lineTo(x + r * 0.1, r * 0.8);
        ctx.stroke();
      }
      
      // 黑色籽
      ctx.fillStyle = '#212121';
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const dist = r * 0.6;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist;
        ctx.beginPath();
        ctx.ellipse(x, y, r * 0.06, r * 0.04, angle, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 橘子：瓣
    if (this.features.segments) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * r * 0.9, Math.sin(angle) * r * 0.9);
        ctx.stroke();
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
