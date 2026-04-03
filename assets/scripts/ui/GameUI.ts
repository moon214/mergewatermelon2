import { _decorator, Component, Node, Label, Button, UITransform, instantiate, Prefab, Vec3, EventHandler } from 'cc';
import { GameManager } from '../core/GameManager';
import { DouyinSDK } from '../platform/DouyinSDK';

const { ccclass, property } = _decorator;

/**
 * 游戏主界面管理
 */
@ccclass('GameUI')
export class GameUI extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    highestScoreLabel: Label = null!;

    @property(Label)
    comboLabel: Label = null!;

    @property(Node)
    propContainer: Node = null!;

    @property(Button)
    pauseButton: Button = null!;

    @property(Button)
    propButton1: Button = null!;
    @property(Button)
    propButton2: Button = null!;
    @property(Button)
    propButton3: Button = null!;

    @property(Prefab)
    resultPanelPrefab: Prefab = null!;
    @property(Prefab)
    propItemPrefab: Prefab = null!;

    private resultPanel: Node | null = null;
    private pausePanel: Node | null = null;

    onLoad() {
        this.pauseButton.clickEvents.push(this.createClickEvent('onPauseClick'));
        this.propButton1.clickEvents.push(this.createClickEvent('onProp1Click'));
        this.propButton2.clickEvents.push(this.createClickEvent('onProp2Click'));
        this.propButton3.clickEvents.push(this.createClickEvent('onProp3Click'));

        this.initPropContainer();
        console.log('[GameUI] 初始化完成');
    }

    start() {
        this.updateHighestScore(GameManager.instance.highestScore);
    }

    public updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
            this.animateScore();
        }
    }

    public updateHighestScore(score: number) {
        if (this.highestScoreLabel) {
            this.highestScoreLabel.string = `最高：${score}`;
        }
    }

    public updateCombo(combo: number) {
        if (this.comboLabel) {
            if (combo >= 2) {
                this.comboLabel.string = `${combo}连击!`;
                this.comboLabel.node.active = true;
                this.animateCombo();
            } else {
                this.comboLabel.node.active = false;
            }
        }
    }

    private initPropContainer() {
        const props = [
            { id: 1, name: '炸弹', count: 3 },
            { id: 2, name: '提示', count: 3 },
            { id: 3, name: '撤销', count: 2 },
        ];

        props.forEach((prop) => {
            const item = instantiate(this.propItemPrefab);
            item.parent = this.propContainer;

            const nameLabel = item.getChildByName('Name')?.getComponent(Label);
            const countLabel = item.getChildByName('Count')?.getComponent(Label);

            if (nameLabel) nameLabel.string = prop.name;
            if (countLabel) countLabel.string = prop.count.toString();
        });
    }

    public onPauseClick() {
        if (GameManager.instance.currentState === GameManager.GameState.PLAYING) {
            GameManager.instance.pauseGame();
            this.showPausePanel();
        }
    }

    public onProp1Click() {
        console.log('[GameUI] 使用道具 1: 炸弹');
    }

    public onProp2Click() {
        console.log('[GameUI] 使用道具 2: 提示');
    }

    public onProp3Click() {
        console.log('[GameUI] 使用道具 3: 撤销');
    }

    private showPausePanel() {
        if (!this.pausePanel) {
            this.pausePanel = new Node('PausePanel');
            this.pausePanel.parent = this.node;

            const bg = this.pausePanel.addComponent(UITransform);
            bg.contentSize = new Vec3(400, 700, 0);

            const resumeBtn = this.createButton('继续游戏', new Vec3(0, 50, 0), 'onResumeClick');
            resumeBtn.parent = this.pausePanel;

            const restartBtn = this.createButton('重新开始', new Vec3(0, -20, 0), 'onRestartClick');
            restartBtn.parent = this.pausePanel;

            const homeBtn = this.createButton('返回首页', new Vec3(0, -90, 0), 'onHomeClick');
            homeBtn.parent = this.pausePanel;
        }

        this.pausePanel.active = true;
    }

    private hidePausePanel() {
        if (this.pausePanel) {
            this.pausePanel.active = false;
        }
    }

    public showResult(score: number, highestScore: number, isNewRecord: boolean) {
        if (!this.resultPanel) {
            this.resultPanel = instantiate(this.resultPanelPrefab);
            this.resultPanel.parent = this.node;
        }

        this.resultPanel.active = true;

        const scoreText = this.resultPanel.getChildByName('Score')?.getComponent(Label);
        const highestText = this.resultPanel.getChildByName('Highest')?.getComponent(Label);
        const recordText = this.resultPanel.getChildByName('NewRecord')?.getComponent(Label);

        if (scoreText) scoreText.string = `得分：${score}`;
        if (highestText) highestText.string = `最高：${highestScore}`;
        if (recordText) recordText.string = isNewRecord ? '🎉 新纪录！' : '';

        const againBtn = this.resultPanel.getChildByName('AgainBtn')?.getComponent(Button);
        const shareBtn = this.resultPanel.getChildByName('ShareBtn')?.getComponent(Button);

        if (againBtn) {
            againBtn.clickEvents = [];
            againBtn.clickEvents.push(this.createClickEvent('onPlayAgainClick'));
        }

        if (shareBtn) {
            shareBtn.clickEvents = [];
            shareBtn.clickEvents.push(this.createClickEvent('onShareClick'));
        }
    }

    public onPlayAgainClick() {
        if (this.resultPanel) {
            this.resultPanel.active = false;
        }
        GameManager.instance.startGame();
    }

    public async onShareClick() {
        const score = GameManager.instance.currentScore;
        const sdk = GameManager.instance.douyinSDK;

        await sdk.shareToVideo({
            title: `我合成了大西瓜！得分：${score}`,
            query: `score=${score}`,
        });
    }

    public onResumeClick() {
        this.hidePausePanel();
        GameManager.instance.resumeGame();
    }

    public onRestartClick() {
        this.hidePausePanel();
        GameManager.instance.startGame();
    }

    public onHomeClick() {
        console.log('[GameUI] 返回首页');
    }

    private animateScore() {
        console.log('[GameUI] 分数动画');
    }

    private animateCombo() {
        console.log('[GameUI] 连击动画');
    }

    private createButton(text: string, pos: Vec3, handler: string): Node {
        const btnNode = new Node('Button');
        const btn = btnNode.addComponent(Button);
        const transform = btnNode.addComponent(UITransform);
        transform.contentSize = new Vec3(200, 50, 0);
        btnNode.setPosition(pos);

        const labelNode = new Node('Label');
        labelNode.parent = btnNode;
        const label = labelNode.addComponent(Label);
        label.string = text;

        btn.clickEvents.push(this.createClickEvent(handler));

        return btnNode;
    }

    private createClickEvent(handler: string) {
        const event = new EventHandler();
        event.target = this.node;
        event.component = 'GameUI';
        event.handler = handler;
        return event;
    }
}
