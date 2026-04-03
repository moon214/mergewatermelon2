import { _decorator, Component, Node, Vec2, instantiate, Prefab } from 'cc';
import { Fruit, FruitType, FruitConfig } from './Fruit';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

@ccclass('FruitMerge')
export class FruitMerge extends Component {
    @property(Prefab)
    mergeEffectPrefab: Prefab = null!;

    public merge(fruit1: Fruit, fruit2: Fruit, mergePos: Vec2) {
        const currentType = fruit1.fruitType;
        if (currentType >= FruitType.WATERMELON) {
            return;
        }
        const nextType = currentType + 1;
        const nextConfig = FruitConfig[nextType];
        console.log(`[FruitMerge] 合成：${FruitConfig[currentType].name} → ${nextConfig.name}`);
        fruit1.node.destroy();
        fruit2.node.destroy();
        this.spawnNextFruit(nextType, mergePos);
        this.playMergeEffect(mergePos, nextType);
        const baseScore = nextConfig.score;
        const isCombo = this.isComboMerge();
        GameManager.instance.addScore(baseScore, isCombo);
        if (mergePos.y > GameManager.FAIL_HEIGHT) {
            GameManager.instance.gameOver();
        }
    }

    private spawnNextFruit(type: FruitType, pos: Vec2) {
        const newFruit = instantiate(GameManager.instance.fruitManager.fruitPrefab);
        newFruit.parent = GameManager.instance.fruitContainer;
        newFruit.setPosition(pos.x, pos.y, 0);
        const fruitScript = newFruit.getComponent(Fruit);
        if (fruitScript) {
            fruitScript.init(type, false);
            fruitScript.release();
        }
    }

    private playMergeEffect(pos: Vec2, fruitType: FruitType) {
        console.log(`[FruitMerge] 播放特效 @ (${pos.x}, ${pos.y})`);
    }

    private isComboMerge(): boolean {
        const now = Date.now();
        const lastMergeTime = GameManager.instance.lastMergeTime;
        const timeDiff = now - lastMergeTime;
        GameManager.instance.lastMergeTime = now;
        return timeDiff < 2000;
    }
}
