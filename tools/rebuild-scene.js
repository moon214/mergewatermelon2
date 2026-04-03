#!/usr/bin/env node

/**
 * 合成大西瓜 2.0 - 自动化重建场景脚本
 * 
 * 用途：生成 Cocos Creator 3.8.8 兼容的场景文件
 * 使用方法：
 *   1. 关闭 Cocos Creator
 *   2. 运行：node tools/rebuild-scene.js
 *   3. 打开 Cocos Creator
 *   4. 场景会自动重建
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SCENES_DIR = path.join(PROJECT_ROOT, 'assets', 'scenes');
const PREFABS_DIR = path.join(PROJECT_ROOT, 'assets', 'prefabs');

// 生成 UUID
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 生成场景文件
function generateScene() {
    const sceneUUID = generateUUID();
    const canvasUUID = generateUUID();
    const gameManagerUUID = generateUUID();
    const fruitContainerUUID = generateUUID();
    const spawnPointUUID = generateUUID();
    const uiUUID = generateUUID();

    const scene = [
        {
            "__type__": "cc.SceneAsset",
            "_name": "Game",
            "_objFlags": 0,
            "_native": "",
            "scene": { "__id__": 1 }
        },
        {
            "__type__": "cc.Scene",
            "_name": "Game",
            "_objFlags": 0,
            "_parent": null,
            "_children": [
                { "__id__": 2 }
            ],
            "_active": true,
            "_level": 0,
            "_components": [],
            "_prefab": null,
            "_persistRoot": false,
            "_globals": {
                "__id__": 7,
                "startCamera": { "__id__": 8 }
            }
        },
        {
            "__type__": "cc.Node",
            "_name": "Canvas",
            "_objFlags": 0,
            "_parent": { "__id__": 1 },
            "_children": [
                { "__id__": 3 },
                { "__id__": 4 },
                { "__id__": 5 },
                { "__id__": 6 }
            ],
            "_active": true,
            "_level": 1,
            "_components": [
                { "__id__": 9 }
            ],
            "_prefab": null,
            "_persistRoot": false,
            "_id": canvasUUID
        },
        {
            "__type__": "cc.Node",
            "_name": "GameManager",
            "_objFlags": 0,
            "_parent": { "__id__": 2 },
            "_children": [],
            "_active": true,
            "_level": 2,
            "_components": [
                { "__id__": 10 },
                { "__id__": 11 },
                { "__id__": 12 },
                { "__id__": 13 },
                { "__id__": 14 }
            ],
            "_prefab": null,
            "_persistRoot": false,
            "_id": gameManagerUUID
        },
        {
            "__type__": "cc.Node",
            "_name": "FruitContainer",
            "_objFlags": 0,
            "_parent": { "__id__": 2 },
            "_children": [],
            "_active": true,
            "_level": 2,
            "_components": [],
            "_prefab": null,
            "_persistRoot": false,
            "_id": fruitContainerUUID
        },
        {
            "__type__": "cc.Node",
            "_name": "SpawnPoint",
            "_objFlags": 0,
            "_parent": { "__id__": 2 },
            "_children": [],
            "_active": true,
            "_level": 2,
            "_components": [],
            "_position": { "__type__": "cc.Vec3", "x": 0, "y": 600, "z": 0 },
            "_prefab": null,
            "_persistRoot": false,
            "_id": spawnPointUUID
        },
        {
            "__type__": "cc.Node",
            "_name": "UI",
            "_objFlags": 0,
            "_parent": { "__id__": 2 },
            "_children": [],
            "_active": true,
            "_level": 2,
            "_components": [
                { "__id__": 15 }
            ],
            "_prefab": null,
            "_persistRoot": false,
            "_id": uiUUID
        },
        {
            "__type__": "cc.SceneGlobals",
            "effectOverrides": null,
            "lightProbeSettings": {
                "__id__": 16
            },
            "skybox": null,
            "shadow": null
        },
        {
            "__type__": "cc.Camera",
            "_name": "Start Camera",
            "_objFlags": 0,
            "_priority": 0,
            "_projection": 1,
            "_fov": 45,
            "_orthoHeight": 360,
            "_near": 1,
            "_far": 2000,
            "_color": { "__type__": "cc.Color", "r": 51, "g": 51, "b": 51, "a": 255 },
            "_clearFlags": 7,
            "_rect": { "__type__": "cc.Rect", "x": 0, "y": 0, "width": 1, "height": 1 },
            "_screenScale": 1,
            "_visibility": 1082392576,
            "_targetTexture": null
        },
        {
            "__type__": "cc.Canvas",
            "_name": "Canvas",
            "_objFlags": 0,
            "_camera": { "__type__": "cc.Camera", "__uuid__": "builtin" },
            "_priority": 0,
            "_alignCanvasWithScreen": true
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "GameManager",
            "_objFlags": 0,
            "script": {
                "__uuid__": "71d6f0e0-9a1a-4c4c-8c4c-4c4c4c4c4c4c"
            }
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "FruitManager",
            "_objFlags": 0,
            "script": {
                "__uuid__": "82e7f1f1-0b2b-5d5d-9d5d-5d5d5d5d5d5d"
            }
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "ScoreManager",
            "_objFlags": 0,
            "script": {
                "__uuid__": "93f8g2g2-1c3c-6e6e-0e6e-6e6e6e6e6e6e"
            }
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "AudioManager",
            "_objFlags": 0,
            "script": {
                "__uuid__": "04g9h3h3-2d4d-7f7f-1f7f-7f7f7f7f7f7f"
            }
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "DouyinSDK",
            "_objFlags": 0,
            "script": {
                "__uuid__": "15h0i4i4-3e5e-8g8g-2g8g-8g8g8g8g8g8g"
            }
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "GameUI",
            "_objFlags": 0,
            "script": {
                "__uuid__": "26i1j5j5-4f6f-9h9h-3h9h-9h9h9h9h9h9h"
            }
        },
        {
            "__type__": "cc.LightProbeSettings",
            "version": 0,
            "editorData": {
                "__id__": 17
            }
        },
        {
            "__type__": "cc.LightProbeEditorData",
            "previewVisible": false
        }
    ];

    return JSON.stringify(scene, null, 2);
}

// 生成预制体文件
function generatePrefab() {
    const prefabUUID = generateUUID();
    const nodeUUID = generateUUID();

    const prefab = [
        {
            "__type__": "cc.Prefab",
            "_name": "Fruit",
            "_objFlags": 0,
            "_native": "",
            "data": {
                "__id__": 1
            }
        },
        {
            "__type__": "cc.Node",
            "_name": "Fruit",
            "_objFlags": 0,
            "_parent": null,
            "_children": [
                { "__id__": 2 }
            ],
            "_active": true,
            "_level": 0,
            "_components": [
                { "__id__": 3 }
            ],
            "_prefab": {
                "__id__": 0
            },
            "_persistRoot": false,
            "_id": nodeUUID
        },
        {
            "__type__": "cc.Node",
            "_name": "Sprite",
            "_objFlags": 0,
            "_parent": { "__id__": 1 },
            "_children": [],
            "_active": true,
            "_level": 1,
            "_components": [
                { "__id__": 4 }
            ],
            "_prefab": null,
            "_persistRoot": false
        },
        {
            "__type__": "cc.MissingScript",
            "_name": "Fruit",
            "_objFlags": 0,
            "script": {
                "__uuid__": "37j2k6k6-5g7g-0i0i-4i0i-0i0i0i0i0i0i"
            }
        },
        {
            "__type__": "cc.Sprite",
            "_name": "Sprite",
            "_objFlags": 0,
            "_customMaterial": null,
            "_srcBlendFactor": 2,
            "_dstBlendFactor": 4,
            "_color": { "__type__": "cc.Color", "r": 255, "g": 255, "b": 255, "a": 255 },
            "_spriteFrame": null,
            "_type": 0,
            "_fillType": 0,
            "_sizeMode": 0,
            "_fillCenter": { "__type__": "cc.Vec2", "x": 0, "y": 0 },
            "_fillStart": 0,
            "_fillRange": 0,
            "_isTrimmedMode": true,
            "_useCustomMesh": false,
            "_atlas": null,
            "_visFlags": 33
        }
    ];

    return JSON.stringify(prefab, null, 2);
}

// 生成 .meta 文件
function generateMetaFile(uuid) {
    return `{
  "ver": "1.2.0",
  "importer": "scene",
  "imported": true,
  "uuid": "${uuid}",
  "files": [
    ".json"
  ],
  "subMetas": {},
  "userData": {}
}`;
}

// 主函数
function main() {
    console.log('🔨 开始重建场景文件...\n');

    // 确保目录存在
    if (!fs.existsSync(SCENES_DIR)) {
        fs.mkdirSync(SCENES_DIR, { recursive: true });
        console.log('✅ 创建 scenes 目录');
    }

    if (!fs.existsSync(PREFABS_DIR)) {
        fs.mkdirSync(PREFABS_DIR, { recursive: true });
        console.log('✅ 创建 prefabs 目录');
    }

    // 备份旧文件
    const oldScenePath = path.join(SCENES_DIR, 'Game.scene');
    const oldPrefabPath = path.join(PREFABS_DIR, 'Fruit.prefab');

    if (fs.existsSync(oldScenePath)) {
        const backupPath = oldScenePath + '.backup';
        fs.renameSync(oldScenePath, backupPath);
        console.log(`✅ 备份旧场景文件：${backupPath}`);
    }

    if (fs.existsSync(oldPrefabPath)) {
        const backupPath = oldPrefabPath + '.backup';
        fs.renameSync(oldPrefabPath, backupPath);
        console.log(`✅ 备份旧预制体文件：${backupPath}`);
    }

    // 生成新场景
    const sceneContent = generateScene();
    fs.writeFileSync(oldScenePath, sceneContent, 'utf8');
    console.log('✅ 生成新场景文件：Game.scene');

    // 生成新预制体
    const prefabContent = generatePrefab();
    fs.writeFileSync(oldPrefabPath, prefabContent, 'utf8');
    console.log('✅ 生成新预制体文件：Fruit.prefab');

    // 更新 .meta 文件
    const sceneUUID = sceneContent.match(/"_id": "([a-f0-9-]+)"/)?.[1] || generateUUID();
    const prefabUUID = prefabContent.match(/"_id": "([a-f0-9-]+)"/)?.[1] || generateUUID();

    const sceneMetaPath = oldScenePath + '.meta';
    const prefabMetaPath = oldPrefabPath + '.meta';

    fs.writeFileSync(sceneMetaPath, generateMetaFile(sceneUUID), 'utf8');
    console.log('✅ 生成场景 .meta 文件');

    fs.writeFileSync(prefabMetaPath, generateMetaFile(prefabUUID), 'utf8');
    console.log('✅ 生成预制体 .meta 文件');

    console.log('\n✅ 场景重建完成！\n');
    console.log('📋 下一步操作：');
    console.log('   1. 打开 Cocos Creator 3.8.8');
    console.log('   2. 项目会自动刷新');
    console.log('   3. 菜单 → 开发者 → 刷新脚本');
    console.log('   4. 打开 Game.scene 场景');
    console.log('   5. 在 GameManager 节点上重新配置组件属性');
    console.log('\n⚠️  注意：场景中的脚本组件需要手动重新添加和配置属性');
}

// 运行
main();
