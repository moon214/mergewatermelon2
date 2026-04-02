import { _decorator, Component, Node, Prefab, instantiate, Label } from 'cc';
import { GameManager } from '../core/GameManager';
import { Fruit, FruitType } from '../fruit/Fruit';
import { DouyinSDK } from '../platform/DouyinSDK';

const { ccclass, property } = _decorator;

export enum PropType {
    BOMB = 1,
    HINT = 2,
    UNDO = 3,
    DOUBLE = 4,
    FIX = 5,
    SHIELD = 6,
}

export const PropConfig: Record<PropType, {
    name: string;
    icon: string;
    price: number;
    adCount: number;
    description: string;
}> = {
    [PropType.BOMB]: { name: '炸弹', icon: '💣', price: 3, adCount: 1, description: '消除指定位置的水果' },
    [PropType.HINT]: { name: '提示', icon: '💡', price: 1, adCount: 1, description: '显示最佳放置位置 5 秒' },
    [PropType.UNDO]: { name: '撤销', icon: '↩️', price: 2, adCount: 1, description: '撤销上一步操作' },
    [PropType.DOUBLE]: { name: '双倍', icon: '✨', price: 6, adCount: 2, description: '本局得分翻倍' },
    [PropType.FIX]: { name: '固定', icon: '🎯', price: 4, adCount: 1, description: '指定下一个水果类型' },
    [PropType.SHIELD]: { name: '护盾', icon: '🛡️', price: 8, adCount: 2, description: '防止一次失败' },
};

export interface PropHistory {
    type: PropType;
    timestamp: number;
    data?: any;
}

@ccclass('PropManager')
export class PropManager extends Component {
    public propInventory: Map<PropType, number> = new Map();
    public usedProps: PropType[] = [];
    public history: PropHistory[] = [];
    public isDoubleScore: boolean = false;
    public isShieldActive: boolean = false;
    public fixedNextFruit: FruitType | null = null;

    @property(Node)
    propContainer: Node = null!;

    @property(Prefab)
    propItemPrefab: Prefab = null!;

    onLoad() {
        this.initInventory();
        this.loadInventory();
    }

    private initInventory() {
        this.propInventory.set(PropType.BOMB, 3);
        this.propInventory.set(PropType.HINT, 3);
        this.propInventory.set(PropType.UNDO, 2);
        this.propInventory.set(PropType.DOUBLE, 1);
        this.propInventory.set(PropType.FIX, 1);
        this.propInventory.set(PropType.SHIELD, 1);
    }

    private loadInventory() {
        const saved = localStorage.getItem('propInventory');
        if (saved) {
            const data = JSON.parse(saved);
            this.propInventory = new Map(Object.entries(data).map(([k, v]) => [parseInt(k) as PropType, v]));
        }
    }

    private saveInventory() {
        const data = Object.fromEntries(this.propInventory);
        localStorage.setItem('propInventory', JSON.stringify(data));
    }

    public async useProp(type: PropType, target?: any): Promise<boolean> {
        const count = this.propInventory.get(type) || 0;
        if (count <= 0) {
            return false;
        }

        const usedCount = this.usedProps.filter(p => p === type).length;
        if (usedCount >= 3) {
            return false;
        }

        console.log('[PropManager] 使用道具:', PropConfig[type].name);

        let success = false;
        switch (type) {
            case PropType.BOMB:
                success = await this.useBomb(target);
                break;
            case PropType.HINT:
                success = await this.useHint();
                break;
            case PropType.UNDO:
                success = await this.useUndo();
                break;
            case PropType.DOUBLE:
                success = await this.useDouble();
                break;
            case PropType.FIX:
                success = await this.useFix(target);
                break;
            case PropType.SHIELD:
                success = await this.useShield();
                break;
        }

        if (success) {
            this.propInventory.set(type, count - 1);
            this.usedProps.push(type);
            this.saveInventory();
            GameManager.instance.audioManager.playSFX('prop');
            this.updatePropUI();
        }

        return success;
    }

    private async useBomb(target: Node): Promise<boolean> {
        if (!target) return false;
        const fruit = target.getComponent(Fruit);
        if (!fruit) return false;
        this.addToHistory(PropType.BOMB, { fruitNode: target });
        target.destroy();
        return true;
    }

    private async useHint(): Promise<boolean> {
        console.log('[PropManager] 提示：显示最佳位置');
        this.addToHistory(PropType.HINT);
        return true;
    }

    private async useUndo(): Promise<boolean> {
        if (this.history.length === 0) return false;
        const lastAction = this.history.pop();
        console.log('[PropManager] 撤销:', lastAction);
        return true;
    }

    private async useDouble(): Promise<boolean> {
        this.isDoubleScore = true;
        this.addToHistory(PropType.DOUBLE);
        console.log('[PropManager] 双倍得分激活');
        return true;
    }

    private async useFix(target: FruitType): Promise<boolean> {
        this.fixedNextFruit = target;
        this.addToHistory(PropType.FIX, { fruitType: target });
        return true;
    }

    private async useShield(): Promise<boolean> {
        this.isShieldActive = true;
        this.addToHistory(PropType.SHIELD);
        console.log('[PropManager] 护盾激活');
        return true;
    }

    private addToHistory(type: PropType, data?: any) {
        this.history.push({ type, timestamp: Date.now(), data });
    }

    private updatePropUI() {
        console.log('[PropManager] 更新道具 UI');
    }

    public getPropCount(type: PropType): number {
        return this.propInventory.get(type) || 0;
    }

    public async watchAdForProp(type: PropType): Promise<boolean> {
        const config = PropConfig[type];
        console.log(`[PropManager] 观看广告获取 ${config.name}，需要观看${config.adCount}次`);
        
        const sdk = GameManager.instance.douyinSDK;
        // TODO: 调用广告 SDK
        return true;
    }
}
