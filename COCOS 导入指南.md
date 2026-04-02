# Cocos Creator 导入指南

**项目:** 合成大西瓜 2.0  
**引擎版本:** Cocos Creator 3.8 LTS  
**日期:** 2026-04-02

---

## 📋 导入前准备

### 1. 确认环境
- [ ] 已安装 Cocos Creator 3.8 LTS
- [ ] 磁盘空间充足（至少 2GB）
- [ ] 网络通畅（首次需下载引擎模块）

### 2. 检查项目文件
```bash
cd /root/.openclaw/workspace/MergeWatermelon2/
ls -la
```

应包含：
- `project.json` ✅
- `.cocos-project.json` ✅
- `tsconfig.json` ✅
- `assets/` 目录 ✅
- `settings/` 目录 ✅

---

## 🚀 导入步骤

### 步骤 1: 启动 Cocos Creator

1. 打开 Cocos Creator 3.8 LTS
2. 等待启动完成

### 步骤 2: 打开项目

1. 点击 **打开项目 (Open Project)** 按钮
2. 浏览到：`/root/.openclaw/workspace/MergeWatermelon2/`
3. 选中该文件夹
4. 点击 **打开 (Open)**

### 步骤 3: 等待资源导入

```
首次导入流程:
1. 解析 project.json (5 秒)
2. 导入资源 (30-60 秒)
3. 生成 TypeScript 声明 (30 秒)
4. 编译脚本 (30 秒)
5. 完成！
```

**总耗时:** 约 2-3 分钟

### 步骤 4: 验证导入

导入完成后检查：
- [ ] 资源管理器显示所有文件
- [ ] 无红色错误标记
- [ ] 控制台无报错

---

## 🔧 场景配置

### 打开 Game.scene

1. 在资源管理器中，双击 `assets/scenes/Game.scene`
2. 场景在编辑器中打开

### 配置 GameManager 节点

1. 在层级管理器中，展开 `Canvas` → 选择 `GameManager` 节点
2. 在检查器面板中，找到 GameManager 组件
3. 配置以下字段：

| 字段 | 操作 | 值 |
|------|------|-----|
| Fruit Prefab | 拖入预制体 | `assets/prefabs/Fruit.prefab` |
| Spawn Point | 选择节点 | `FruitContainer` |
| Fruit Container | 选择节点 | `FruitContainer` |

### 添加缺失的组件

如果 GameManager 节点缺少以下组件，手动添加：

1. **FruitManager** 组件
   - 点击"添加组件" → 搜索"FruitManager" → 添加

2. **ScoreManager** 组件
   - 点击"添加组件" → 搜索"ScoreManager" → 添加

3. **AudioManager** 组件
   - 点击"添加组件" → 搜索"AudioManager" → 添加

4. **DouyinSDK** 组件
   - 点击"添加组件" → 搜索"DouyinSDK" → 添加

5. **PropManager** 组件
   - 点击"添加组件" → 搜索"PropManager" → 添加

6. **AdManager** 组件
   - 点击"添加组件" → 搜索"AdManager" → 添加

7. **GameUI** 组件
   - 点击"添加组件" → 搜索"GameUI" → 添加

8. **ResultUI** 组件
   - 创建新节点 `ResultUI`，添加 ResultUI 组件

---

## 🎮 运行测试

### 步骤 1: 点击运行

1. 点击编辑器顶部的 **运行 (Play)** 按钮 ▶️
2. 游戏窗口打开

### 步骤 2: 测试功能

| 测试项 | 操作 | 预期结果 |
|--------|------|---------|
| 水果生成 | 游戏开始 | 顶部出现待下落水果 |
| 拖拽移动 | 鼠标左右拖动 | 水果跟随移动 |
| 下落 | 松开鼠标 | 水果自由下落 |
| 碰撞 | 两个相同水果接触 | 合成更高级水果 |
| 分数 | 合成成功 | 分数正确增加 |
| 连击 | 快速连续合成 | 显示连击倍率 |

### 步骤 3: 检查控制台

打开控制台（底部面板），应看到：
```
[GameManager] 游戏初始化完成
[GameManager] 游戏开始
[FruitManager] 生成水果：樱桃
[Fruit] 初始化：樱桃
```

---

## 🐛 常见问题

### 问题 1: 打开项目报错"版本不匹配"
**解决:**
```
确保使用 Cocos Creator 3.8 LTS
其他版本可能不兼容
```

### 问题 2: TypeScript 报错"找不到模块 'cc'"
**解决:**
```
1. 菜单：项目 → 重新生成 TS 声明
2. 等待生成完成
3. 重启编辑器
```

### 问题 3: 场景打开后空白
**解决:**
```
1. 检查 Canvas 节点是否存在
2. 检查 Camera 节点是否存在
3. 重新打开场景文件
```

### 问题 4: 脚本编译错误
**解决:**
```
1. 检查控制台错误信息
2. 确认所有脚本语法正确
3. 清理缓存：删除 library/ temp/ 文件夹
4. 重新打开项目
```

### 问题 5: 水果不显示图片
**解决:**
```
1. 检查 assets/textures/fruits/ 是否有 8 个 PNG
2. 检查 Fruit.ts 的 updateRender() 方法
3. 检查 Sprite 组件是否启用
4. 重新导入纹理资源
```

### 问题 6: 物理效果异常
**解决:**
```
1. 项目设置 → Physics → 确认 Gravity Y = -9.8
2. 检查 RigidBody2D 组件配置
3. 检查 CircleCollider2D 半径设置
```

---

## 📦 构建发布

### 步骤 1: 打开构建面板

1. 菜单：**构建 (Build)** → **构建发布 (Build)**
2. 或点击工具栏的构建按钮

### 步骤 2: 选择平台

| 平台 | 用途 |
|------|------|
| Web | 浏览器测试 |
| 抖音小游戏 | 正式发布 |

### 步骤 3: 配置构建选项

```
构建配置:
- 包名：com.yourcompany.mergewatermelon2
- 版本号：1.0.0
- 屏幕方向：竖屏
- 分辨率：400x700
```

### 步骤 4: 开始构建

1. 点击 **构建 (Build)** 按钮
2. 等待构建完成（约 1-2 分钟）
3. 构建输出目录：`build/`

### 步骤 5: 导入抖音开发者工具

1. 打开抖音开发者工具
2. 导入 `build/douyin-mini-game/` 目录
3. 填写 AppID
4. 真机测试
5. 上传审核

---

## ✅ 导入完成检查清单

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

## 📞 技术支持

### 文档
- Cocos Creator 3.8 文档：https://docs.cocos.com/creator/3.8/zh/
- 抖音小游戏文档：https://developer.open-douyin.com/

### 社区
- Cocos 论坛：https://forum.cocos.org/
- 抖音开放平台社区：https://developer.open-douyin.com/community

---

**祝导入顺利！** 🎮
