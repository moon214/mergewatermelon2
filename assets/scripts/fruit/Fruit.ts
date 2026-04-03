import { _decorator, Component, Node, CircleCollider2D, RigidBody2D, Contact2DType, IPhysics2DContact, Vec2, Sprite, SpriteFrame, resources } from 'cc';
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

export interface FruitConfigType {
    name: string;
    score: number;
    radius: number;
    color: string;
    texture: string;
}

export const FruitConfig: Record<FruitType, FruitConfigType> = {
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
export class Fruit extends Component {
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
        // Cocos Creator 3.8: wake() 方法不存在，直接设置 type 即可
        this.rigidbody.type = RigidBody2D.Type.Dynamic;
        console.log('[Fruit] 释放下落');
    }

    private async updateRender() {
        const config = FruitConfig[this.fruitType];
        try {
            const spriteFrame = await resources.load<SpriteFrame>(config.texture, SpriteFrame);
            if (spriteFrame) {
                this.sprite.spriteFrame = spriteFrame;
            }
        } catch (err) {
            console.error(`[Fruit] 加载纹理失败：${config.texture}`, err);
        }
    }

    public checkFail(): boolean {
        return this.node.position.y > GameManager.FAIL_HEIGHT;
    }
}
