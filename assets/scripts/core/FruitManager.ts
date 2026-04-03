import { _decorator, Component, Node, Prefab, instantiate, Vec3, math, input, Input, EventTouch } from 'cc';
import { GameManager, GameState } from './GameManager';
import { Fruit, FruitType } from '../fruit/Fruit';

const { ccclass, property } = _decorator;

@ccclass('FruitManager')
export class FruitManager extends Component {
    @property(Prefab)
    fruitPrefab: Prefab = null!;

    private currentFruit: Node | null = null;
    private currentFruitType: FruitType = FruitType.CHERRY;
    private nextFruitType: FruitType = FruitType.CHERRY;

    private spawnY: number = 600;
    private moveRange: number = 180;
    private touchStartX: number = 0;
    private isTouching: boolean = false;

    private spawnProbabilities: number[] = [
        0.35, 0.25, 0.18, 0.12, 0.07, 0.03,
    ];

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public spawnFirstFruit() {
        this.nextFruitType = this.getRandomFruitType();
        this.spawnFruit();
    }

    private spawnFruit() {
        if (GameManager.instance.currentState !== GameState.PLAYING) {
            return;
        }

        this.currentFruitType = this.nextFruitType;
        this.nextFruitType = this.getRandomFruitType();

        this.currentFruit = instantiate(this.fruitPrefab);
        this.currentFruit.parent = GameManager.instance.fruitContainer;
        this.currentFruit.setPosition(0, this.spawnY, 0);

        const fruitScript = this.currentFruit.getComponent(Fruit);
        if (fruitScript) {
            fruitScript.init(this.currentFruitType, false);
        }

        console.log(`[FruitManager] 生成水果：${FruitType[this.currentFruitType]}`);
    }

    private onTouchStart(event: EventTouch) {
        if (GameManager.instance.currentState !== GameState.PLAYING || !this.currentFruit) {
            return;
        }
        
        const touchLoc = event.getUILocation();
        this.touchStartX = touchLoc.x;
        this.isTouching = true;
        
        const currentPos = this.currentFruit.position;
        this.touchStartX = currentPos.x - (touchLoc.x - currentPos.x);
    }

    private onTouchMove(event: EventTouch) {
        if (!this.currentFruit || GameManager.instance.currentState !== GameState.PLAYING || !this.isTouching) {
            return;
        }

        const touchLoc = event.getUILocation();
        const currentPos = this.currentFruit.position;
        let newX = touchLoc.x;
        newX = math.clamp(newX, -this.moveRange, this.moveRange);
        this.currentFruit.setPosition(newX, currentPos.y, currentPos.z);
    }

    private onTouchEnd(event: EventTouch) {
        if (!this.currentFruit || GameManager.instance.currentState !== GameState.PLAYING) {
            return;
        }
        
        this.isTouching = false;

        GameManager.instance.audioManager.playSFX('drop');

        const fruitScript = this.currentFruit.getComponent(Fruit);
        if (fruitScript) {
            fruitScript.release();
        }

        this.scheduleOnce(() => {
            this.spawnFruit();
        }, 1.0);
    }

    private getRandomFruitType(): FruitType {
        const rand = Math.random();
        let cumulative = 0;

        for (let i = 0; i < this.spawnProbabilities.length; i++) {
            cumulative += this.spawnProbabilities[i];
            if (rand < cumulative) {
                return i as FruitType;
            }
        }

        return FruitType.CHERRY;
    }

    public clearAllFruits() {
        if (this.currentFruit) {
            this.currentFruit.destroy();
            this.currentFruit = null;
        }
        GameManager.instance.fruitContainer.removeAllChildren();
    }
}
