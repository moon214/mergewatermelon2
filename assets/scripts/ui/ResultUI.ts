import { _decorator, Component, Node, Label, Button, Sprite } from 'cc';
import { GameManager } from '../core/GameManager';
import { DouyinSDK } from '../platform/DouyinSDK';

const { ccclass, property } = _decorator;

/**
 * 结算界面管理
 */
@ccclass('ResultUI')
export class ResultUI extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    highestScoreLabel: Label = null!;

    @property(Label)
    newRecordLabel: Label = null!;

    @property(Button)
    playAgainButton: Button = null!;

    @property(Button)
    shareButton: Button = null!;

    @property(Button)
    homeButton: Button = null!;

    private isNewRecord: boolean = false;

    onLoad() {
        this.playAgainButton.clickEvents.push(this.createClickEvent('onPlayAgainClick'));
        this.shareButton.clickEvents.push(this.createClickEvent('onShareClick'));
        this.homeButton.clickEvents.push(this.createClickEvent('onHomeClick'));

        this.node.active = false;
        console.log('[ResultUI] 初始化完成');
    }

    /**
     * 显示结算界面
     */
    public show(score: number, highestScore: number) {
        this.isNewRecord = score > highestScore;

        if (this.scoreLabel) {
            this.scoreLabel.string = `得分：${score}`;
        }

        if (this.highestScoreLabel) {
            this.highestScoreLabel.string = `最高：${highestScore}`;
        }

        if (this.newRecordLabel) {
            this.newRecordLabel.string = this.isNewRecord ? '🎉 新纪录！' : '';
            this.newRecordLabel.node.active = this.isNewRecord;
        }

        this.node.active = true;
        console.log('[ResultUI] 显示结算界面');
    }

    /**
     * 隐藏结算界面
     */
    public hide() {
        this.node.active = false;
    }

    /**
     * 再玩一次
     */
    public onPlayAgainClick() {
        this.hide();
        GameManager.instance.startGame();
        console.log('[ResultUI] 再玩一次');
    }

    /**
     * 分享
     */
    public async onShareClick() {
        const score = GameManager.instance.currentScore;
        const sdk = GameManager.instance.douyinSDK;

        await sdk.shareToVideo({
            title: `我合成了大西瓜！得分：${score}`,
            query: `score=${score}`,
        });

        console.log('[ResultUI] 分享');
    }

    /**
     * 返回首页
     */
    public onHomeClick() {
        console.log('[ResultUI] 返回首页');
        // TODO: 加载主场景
    }

    private createClickEvent(handler: string) {
        // @ts-ignore
        const event = new Component.EventHandler();
        event.target = this.node;
        event.component = 'ResultUI';
        event.handler = handler;
        return event;
    }
}
