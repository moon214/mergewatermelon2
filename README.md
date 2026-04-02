# 合成大西瓜 2.0 - 抖音小游戏

🎮 经典合成游戏，抖音小游戏平台

---

## 📋 快速导入指南

### 步骤 1: 打开 Cocos Creator

1. 启动 **Cocos Creator 3.8 LTS**
2. 点击 **打开项目 (Open Project)**
3. 选择此文件夹：`/root/.openclaw/workspace/MergeWatermelon2/`
4. 点击 **打开 (Open)**

### 步骤 2: 等待资源导入

Cocos Creator 会自动导入所有资源，首次打开可能需要 1-2 分钟。

### 步骤 3: 配置 GameManager

1. 在 **资源管理器** 中，双击打开 `assets/scenes/Game.scene`
2. 在 **层级管理器** 中，选择 `Canvas/GameManager` 节点
3. 在 **检查器** 面板中，配置以下字段：

| 字段 | 值 |
|------|-----|
| Fruit Prefab | 拖入 `assets/prefabs/Fruit.prefab` |
| Spawn Point | 选择 `FruitContainer` 节点 |
| Fruit Container | 选择 `FruitContainer` 节点 |

### 步骤 4: 配置 Fruit 预制体

1. 在 **资源管理器** 中，双击 `assets/prefabs/Fruit.prefab`
2. 确认已挂载以下组件：
   - ✅ Sprite
   - ✅ CircleCollider2D
   - ✅ RigidBody2D
   - ✅ Fruit (脚本)

### 步骤 5: 运行测试

1. 点击编辑器顶部的 **运行 (Play)** 按钮 ▶️
2. 测试功能：
   - 🖱️ 鼠标拖拽移动水果
   - ⬇️ 松开鼠标让水果下落
   - 💥 相同水果碰撞合成
   - 📊 分数和连击显示

### 步骤 6: 构建发布

1. 菜单：**构建 (Build) → 构建发布 (Build)**
2. 平台选择：**抖音小游戏 (Douyin Mini Game)**
3. 配置：
   - AppID: (填写你的抖音 AppID)
   - 包名：`com.yourcompany.mergewatermelon2`
   - 版本号：`1.0.0`
4. 点击 **构建 (Build)**
5. 构建完成后，用 **抖音开发者工具** 打开构建目录
6. 真机测试并上传审核

---

## 🎮 游戏说明

### 玩法
- 拖拽水果左右移动
- 松开让水果下落
- 相同等级水果碰撞合成更高等级
- 避免水果堆超过失败线

### 水果等级

| 等级 | 名称 | 分数 |
|------|------|------|
| 1 | 🍒 樱桃 | 10 |
| 2 | 🍓 草莓 | 20 |
| 3 | 🍊 橘子 | 40 |
| 4 | 🍋 柠檬 | 80 |
| 5 | 🥝 猕猴桃 | 160 |
| 6 | 🍅 西红柿 | 320 |
| 7 | 🍑 桃子 | 640 |
| 8 | 🍉 西瓜 | 1280 |

### 连击倍率

| 连击数 | 倍率 |
|--------|------|
| 2-3 | 1.2x |
| 4-5 | 1.5x |
| 6-9 | 2.0x |
| 10+ | 3.0x |

---

## 🛠️ 项目结构

```
MergeWatermelon2/
├── assets/
│   ├── scripts/          # TypeScript 代码
│   ├── textures/         # 图片资源
│   ├── scenes/           # 场景文件
│   └── prefabs/          # 预制体
├── settings/             # 项目设置
├── project.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── README.md             # 本文件
```

---

## 📦 依赖

- **引擎:** Cocos Creator 3.8 LTS
- **语言:** TypeScript
- **平台:** 抖音小游戏
- **物理:** Box2D (内置)

---

## 🐛 常见问题

### Q: 打开项目后报错？
A: 确保使用 Cocos Creator 3.8 LTS 版本，其他版本可能不兼容。

### Q: 水果不显示图片？
A: 检查 `assets/textures/fruits/` 目录下的 PNG 文件是否存在。

### Q: 拖拽没反应？
A: 确认场景中有 EventSystem 组件（Cocos 默认创建）。

### Q: 物理效果异常？
A: 检查 Physics2D 设置，确保重力为 (0, -9.8)。

---

## 📞 技术支持

如有问题，请查阅：
- Cocos Creator 文档：https://docs.cocos.com/creator/3.8/
- 抖音小游戏文档：https://developer.open-douyin.com/

---

**祝开发顺利！🎉**
