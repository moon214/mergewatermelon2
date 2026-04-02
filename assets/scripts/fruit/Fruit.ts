import { _decorator, Component, Node, CircleCollider2D, RigidBody2D, Contact2DType, IPhysics2DContact, Vec2, Sprite, SpriteFrame, Texture2D, resources } from 'cc';
import { GameManager } from '../core/GameManager';
import { FruitMerge } from './FruitMerge';

const { ccclass, property } = _decorator;

export enum FruitType {
    CHERRY = 0,
    STRAWBERRY = 1,
    ORANGE = 2,
    LEMON = 3,
    KIWI = 4,
    TOMATO = 5,
    PEACH = 6,
    WATERMELON = 7,
}

export const FruitConfig: Record<FruitType, {
    name: string;
    score: number;
    radius: number;
    color: string;
    texture: string;
}> = {
    [FruitType.CHERRY]: { name: '樱桃', score: 10, radius: 25, color: '#FF6B6B', texture: 'fruits/fruit_01_cherry' },
    [FruitType.STRAWBERRY]: { name: '草莓', score: 20, radius: 32, color: '#FF8E8E', texture: 'fruits/fruit_02_strawberry' },
    [FruitType.ORANGE]: { name: '橘子', score: 40, radius: 40, color: '#FFA726', texture: 'fruits/fruit_03_orange' },
    [FruitType.LEMON]: { name: '柠檬', score: 80, radius: 50, color: '#FFD54F', texture: 'fruits/fruit_04_lemon' },
    [FruitType.KIWI]: { name: '猕猴桃', score: 160, radius: 62, color: '#8BC34A', texture: 'fruits/fruit_05_kiwi' },
    [FruitType.TOMATO]: { name: '西红柿', score: 320, radius: 75, color: '#E53935', texture: 'fruits/fruit_06_tomato' },
    [FruitType.PEACH]: { name: '桃子', score: 640, radius: 90, color: '#F48FB1', texture: 'fruits/fruit_07_peach' },
    [FruitType.WATERMELON]: { name: '西瓜', score: 1280, radius: 110, color: '#2E7D32', texture: 'fruits/fruit_08_watermelon' },
};

@ccclass('Fruit')
export class Fruit extends Component implements Contact2DType {
    private fruitType: FruitType = FruitType.CHERRY;
    private isReleased: boolean = false;

    private collider: CircleCollider2D = null!;
    private rigidbody: RigidBody2D = null!;
    private sprite: Sprite = null!;

    onLoad() {
        this.collider = this.getComponent(CircleCollider2D) || this.addComponent(CircleCollider2D);
        this.rigidbody = this.getComponent(RigidBody2D) || this.addComponent(RigidBody2D);
        this.sprite = this.getComponent(Sprite) || this.addComponent(Sprite);

        this.rigidbody.gravityScale = 1.0;
        this.rigidbody.linearDamping = 0.5;
        this.rigidbody.angularDamping = 0.5;

        this.collider.restitution = 0.3;
        this.collider.friction = 0.8;

        this.collider.onContactBegin = this.onContactBegin.bind(this);
    }

    public init(type: FruitType, isStatic: boolean = true) {
        this.fruitType = type;
        const config = FruitConfig[type];

        this.collider.radius = config.radius;

        if (isStatic) {
            this.rigidbody.type = RigidBody2D.Type.Static;
        } else {
            this.rigidbody.type = RigidBody2D.Type.Dynamic;
        }

        this.updateRender();
        console.log(`[Fruit] 初始化：${config.name}`);
    }

    public release() {
        this.isReleased = true;
        this.rigidbody.type = RigidBody2D.Type.Dynamic;
        this.rigidbody.wake();
        console.log('[Fruit] 释放下落');
    }

    onContactBegin(selfCollider: CircleCollider2D, otherCollider: CircleCollider2D, contact: IPhysics2DContact | null): boolean {
        const otherFruit = otherCollider.node.getComponent(Fruit);
        if (!otherFruit || !otherFruit.isReleased) {
            return true;
        }

        if (otherFruit.fruitType === this.fruitType) {
            const mergePos = this.getMergePosition(otherFruit);
            GameManager.instance.fruitManager.getComponent(FruitMerge).merge(this, otherFruit, mergePos);
        }

        return true;
    }

    private getMergePosition(other: Fruit): Vec2 {
        const pos1 = this.node.position;
        const pos2 = other.node.position;
        return new Vec2((pos1.x + pos2.x) / 2, (pos1.y + pos2.y) / 2);
    }

    private updateRender() {
        const config = FruitConfig[this.fruitType];
        resources.load(config.texture, SpriteFrame, (err, spriteFrame) => {
            if (!err && spriteFrame) {
                this.sprite.spriteFrame = spriteFrame;
            } else {
                console.warn(`[Fruit] 加载纹理失败：${config.texture}`);
            }
        });
    }

    public checkFail(): boolean {
        return this.node.position.y > GameManager.FAIL_HEIGHT;
    }
}
