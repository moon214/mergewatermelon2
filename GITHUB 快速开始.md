# GitHub 快速开始 - 合成大西瓜 2.0

**仓库:** https://github.com/moon214/mergewatermelon2  
**日期:** 2026-04-02  
**状态:** ✅ 已推送到 GitHub

---

## ✅ Git 推送完成

```
仓库地址：https://github.com/moon214/mergewatermelon2.git
分支：main
提交：e763de8
文件：53 个
代码量：4,527 行
```

---

## 🚀 Windows 本地克隆

### 方式 1: 使用 Git Bash

```powershell
# 1. 打开 Git Bash
# 2. 克隆仓库
git clone https://github.com/moon214/mergewatermelon2.git

# 3. 进入项目目录
cd mergewatermelon2

# 4. 用 Cocos Creator 打开
# 启动 Cocos Creator 3.8 LTS → 打开项目 → 选择 mergewatermelon2 文件夹
```

### 方式 2: 使用 GitHub Desktop

```
1. 打开 GitHub Desktop
2. File → Clone Repository
3. 选择 moon214/mergewatermelon2
4. 选择本地路径（如 C:\Projects\）
5. 点击 Clone
6. 用 Cocos Creator 打开
```

### 方式 3: 直接下载 ZIP

```
1. 访问：https://github.com/moon214/mergewatermelon2
2. 点击 "Code" → "Download ZIP"
3. 解压到 C:\Projects\
4. 用 Cocos Creator 打开
```

---

## 📦 在 Cocos Creator 中打开

### 步骤 1: 启动 Cocos Creator

```
1. 打开 Cocos Creator 3.8 LTS
2. 如果没有安装，先下载安装：
   https://www.cocos.com/creator_prev
```

### 步骤 2: 打开项目

```
1. 点击"打开项目" (Open Project)
2. 浏览到克隆的文件夹
   C:\Projects\mergewatermelon2\
3. 点击"打开"
4. 等待导入完成（首次约 2-3 分钟）
```

### 步骤 3: 配置场景

```
1. 资源管理器 → 双击 assets/scenes/Game.scene
2. 层级管理器 → 选择 Canvas/GameManager 节点
3. 检查器 → GameManager 组件
4. 拖入 assets/prefabs/Fruit.prefab 到 "Fruit Prefab" 字段
5. 拖入 FruitContainer 节点到 "Fruit Container" 字段
```

### 步骤 4: 添加组件

点击"添加组件"按钮，依次添加：
- FruitManager
- ScoreManager
- AudioManager
- DouyinSDK
- PropManager
- AdManager
- GameUI
- ResultUI

### 步骤 5: 运行测试

```
1. 点击编辑器顶部 ▶️ 运行按钮
2. 测试功能：
   - 鼠标拖拽移动水果
   - 松开鼠标让水果下落
   - 相同水果碰撞合成
   - 分数正确增加
```

---

## 📋 导入后检查清单

### 资源导入
- [ ] 所有 TypeScript 文件无错误
- [ ] 8 个水果 PNG 正常显示
- [ ] Fruit.prefab 预制体正常
- [ ] Game.scene 场景正常

### 组件配置
- [ ] GameManager 组件已添加
- [ ] FruitManager 组件已添加
- [ ] ScoreManager 组件已添加
- [ ] AudioManager 组件已添加
- [ ] PropManager 组件已添加
- [ ] AdManager 组件已添加
- [ ] GameUI 组件已添加
- [ ] ResultUI 组件已添加
- [ ] Fruit Prefab 字段已关联

### 功能测试
- [ ] 游戏可以运行
- [ ] 水果可以拖拽
- [ ] 水果可以下落
- [ ] 合成逻辑正常
- [ ] 分数显示正常
- [ ] 无控制台错误

---

## 🔄 后续同步

### 从 GitHub 拉取更新

```powershell
cd mergewatermelon2
git pull origin main
```

### 推送本地修改到 GitHub

```powershell
# 提交修改
git add .
git commit -m "修复 XXX 问题"
git push origin main
```

---

## 📖 参考文档

| 文档 | 用途 |
|------|------|
| `README.md` | 项目快速指南 |
| `COCOS 导入指南.md` | 详细导入步骤 |
| `WINDOWS 适配说明.md` | Windows 特定说明 |
| `导入检查清单.md` | 逐项检查 |
| `部署说明.md` | 部署流程 |

---

## 🎯 下一步

```
✅ Day 1-3: 代码开发完成
✅ Day 3: Git 推送到 GitHub
⏳ Day 4: 本地克隆 + Cocos 导入 + 测试
⏳ Day 4: 构建抖音小游戏包
⏳ Day 4: 提交审核
```

---

## 🎮 项目预览

### 游戏信息
- **名称:** 合成大西瓜 2.0
- **类型:** 休闲合成
- **平台:** 抖音小游戏
- **引擎:** Cocos Creator 3.8 LTS
- **语言:** TypeScript

### 核心玩法
- 拖拽水果左右移动
- 松开让水果下落
- 相同等级水果合成更高等级
- 避免超过失败线

### 水果等级
```
🍒 樱桃 (10 分)
  ↓
🍓 草莓 (20 分)
  ↓
🍊 橘子 (40 分)
  ↓
🍋 柠檬 (80 分)
  ↓
🥝 猕猴桃 (160 分)
  ↓
🍅 西红柿 (320 分)
  ↓
🍑 桃子 (640 分)
  ↓
🍉 西瓜 (1280 分) - 最高级
```

---

## 📞 遇到问题？

### 克隆问题
```
如果克隆失败，检查：
1. 网络连接正常
2. Git 已安装
3. GitHub 账号已登录
```

### Cocos 导入问题
```
参考：COCOS 导入指南.md
常见问题：
- TypeScript 报错 → 重新生成 TS 声明
- 资源不显示 → 检查文件路径
- 运行报错 → 检查组件配置
```

### 游戏运行问题
```
参考：WINDOWS 适配说明.md
常见问题：
- 拖拽无反应 → 检查 EventSystem
- 物理异常 → 检查重力设置
- 图片不显示 → 检查纹理导入
```

---

**现在可以克隆并打开项目了！** 🚀

**GitHub 仓库:** https://github.com/moon214/mergewatermelon2
