import { _decorator, Component, Node, director, Prefab, instantiate, Vec3, math } from 'cc';
import { FruitManager } from './FruitManager';
import { ScoreManager } from './ScoreManager';
import { AudioManager } from './AudioManager';
import { DouyinSDK } from '../platform/DouyinSDK';

const { ccclass, property } = _decorator;

/**
 * 游戏状态枚举
 */
export enum GameState {
    WAITING,
    PLAYING,
    PAUSED,
    GAME_OVER
}

/**
 * 游戏全局管理器
 */
@ccclass('GameManager')
export class GameManager extends Component {
    public static instance: GameManager;

    public currentState: GameState = GameState.WAITING;

    public static readonly GAME_WIDTH: number = 400;
    public static readonly GAME_HEIGHT: number = 700;
    public static readonly FAIL_HEIGHT: number = 650;

    @property(Prefab)
    fruitPrefab: Prefab = null!;

    @property(Node)
    spawnPoint: Node = null!;

    @property(Node)
    fruitContainer: Node = null!;

    public fruitManager: FruitManager = null!;
    public scoreManager: ScoreManager = null!;
    public audioManager: AudioManager = null!;
    public douyinSDK: DouyinSDK = null!;

    public currentScore: number = 0;
    public highestScore: number = 0;
    public comboCount: number = 0;
    public lastMergeTime: number = 0;

    onLoad() {
        if (!GameManager.instance) {
            GameManager.instance = this;
        }

        this.fruitManager = this.getComponent(FruitManager) || this.addComponent(FruitManager);
        this.scoreManager = this.getComponent(ScoreManager) || this.addComponent(ScoreManager);
        this.audioManager = this.getComponent(AudioManager) || this.addComponent(AudioManager);
        this.douyinSDK = this.getComponent(DouyinSDK) || this.addComponent(DouyinSDK);

        this.douyinSDK.init();
        this.loadHighestScore();
        console.log('[GameManager] 游戏初始化完成');
    }

    start() {
        this.startGame();
    }

    public startGame() {
        this.currentState = GameState.PLAYING;
        this.currentScore = 0;
        this.comboCount = 0;
        this.lastMergeTime = 0;
        this.fruitManager.clearAllFruits();
        this.scoreManager.updateScore(0);
        this.scoreManager.updateCombo(0);
        this.fruitManager.spawnFirstFruit();
        this.audioManager.playBGM();
        console.log('[GameManager] 游戏开始');
    }

    public gameOver() {
        this.currentState = GameState.GAME_OVER;
        this.audioManager.stopBGM();
        this.audioManager.playSFX('fail');
        this.saveHighestScore();
        this.showResultUI();
        console.log(`[GameManager] 游戏结束 - 得分：${this.currentScore}`);
    }

    public pauseGame() {
        if (this.currentState === GameState.PLAYING) {
            this.currentState = GameState.PAUSED;
            director.pause();
        }
    }

    public resumeGame() {
        if (this.currentState === GameState.PAUSED) {
            this.currentState = GameState.PLAYING;
            director.resume();
        }
    }

    public addScore(baseScore: number, isCombo: boolean = false) {
        let multiplier = 1.0;
        if (isCombo) {
            this.comboCount++;
            multiplier = this.getComboMultiplier();
        } else {
            this.comboCount = 0;
        }
        const finalScore = Math.floor(baseScore * multiplier);
        this.currentScore += finalScore;
        this.scoreManager.updateScore(this.currentScore);
        this.scoreManager.updateCombo(this.comboCount);
        if (isCombo) {
            this.audioManager.playSFX('combo');
        }
    }

    private getComboMultiplier(): number {
        if (this.comboCount >= 10) return 3.0;
        if (this.comboCount >= 6) return 2.0;
        if (this.comboCount >= 4) return 1.5;
        if (this.comboCount >= 2) return 1.2;
        return 1.0;
    }

    public checkFail(fruitY: number): boolean {
        return fruitY > GameManager.FAIL_HEIGHT;
    }

    private async saveHighestScore() {
        if (this.currentScore > this.highestScore) {
            this.highestScore = this.currentScore;
            try {
                localStorage.setItem('highestScore', this.highestScore.toString());
            } catch (err) {
                console.error('[GameManager] 保存最高分到本地失败', err);
            }
            await this.douyinSDK.saveCloudStorage('highest_score', this.highestScore.toString());
            console.log(`[GameManager] 新纪录！${this.highestScore}`);
        }
    }

    private loadHighestScore() {
        try {
            const saved = localStorage.getItem('highestScore');
            this.highestScore = saved ? parseInt(saved) : 0;
        } catch (err) {
            console.error('[GameManager] 加载最高分失败', err);
            this.highestScore = 0;
        }
        console.log(`[GameManager] 加载最高分：${this.highestScore}`);
    }

    private showResultUI() {
        console.log('[GameManager] 显示结算界面');
    }
}
