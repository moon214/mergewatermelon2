@echo off
chcp 65001 >nul
echo ========================================
echo   合成大西瓜 2.0 - 场景重建工具
echo ========================================
echo.

REM 检查 Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ 错误：未找到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js 已安装
echo.

REM 关闭 Cocos Creator 提醒
echo ⚠️  重要：请确保 Cocos Creator 已完全关闭！
echo.
set /p confirmed="Cocos Creator 已关闭吗？(Y/N): "
if /i not "%confirmed%"=="Y" (
    echo.
    echo 请先关闭 Cocos Creator，然后重新运行此脚本
    pause
    exit /b 1
)

echo.
echo 🔨 开始重建场景...
echo.

REM 进入项目目录
cd /d "%~dp0.."

REM 备份旧文件
if exist "assets\scenes\Game.scene" (
    copy "assets\scenes\Game.scene" "assets\scenes\Game.scene.backup" >nul
    echo ✅ 已备份旧场景文件
)

if exist "assets\prefabs\Fruit.prefab" (
    copy "assets\prefabs\Fruit.prefab" "assets\prefabs\Fruit.prefab.backup" >nul
    echo ✅ 已备份旧预制体文件
)

REM 删除缓存目录
echo.
echo 🗑️  清理缓存...
if exist "library" (
    rmdir /s /q "library"
    echo ✅ 已删除 library/
)

if exist "temp" (
    rmdir /s /q "temp"
    echo ✅ 已删除 temp/
)

if exist "local" (
    rmdir /s /q "local"
    echo ✅ 已删除 local/
)

REM 运行重建脚本
echo.
echo 🔧 生成新场景文件...
node tools\rebuild-scene.js

if %ERRORLEVEL% neq 0 (
    echo.
    echo ❌ 场景重建失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 场景重建完成！
echo ========================================
echo.
echo 📋 下一步操作：
echo    1. 打开 Cocos Creator 3.8.8
echo    2. 打开 mergewatermelon2 项目
echo    3. 等待资源导入完成
echo    4. 菜单 → 开发者 → 刷新脚本
echo    5. 打开 Game.scene 场景
echo    6. 配置 GameManager 组件属性
echo.
echo ⚠️  重要：需要在 Cocos 中手动配置组件引用
echo    - Fruit Prefab
echo    - FruitContainer 节点
echo    - SpawnPoint 节点
echo    - UI 组件
echo.
pause
