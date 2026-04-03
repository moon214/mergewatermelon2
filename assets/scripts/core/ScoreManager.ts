import { _decorator, Component, Node, Label } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 分数管理器
 */
@ccclass('ScoreManager')
export class ScoreManager extends Component {
    @property(Label)
    scoreLabel: Label = null!;

    @property(Label)
    comboLabel: Label = null!;

    @property(Label)
    highestScoreLabel: Label = null!;

    onLoad() {
        this.updateScore(0);
        this.updateCombo(0);
        this.updateHighestScore(0);
    }

    public updateScore(score: number) {
        if (this.scoreLabel) {
            this.scoreLabel.string = score.toString();
        }
    }

    public updateCombo(combo: number) {
        if (this.comboLabel) {
            if (combo >= 2) {
                this.comboLabel.string = `${combo}连击!`;
                this.comboLabel.node.active = true;
            } else {
                this.comboLabel.node.active = false;
            }
        }
    }

    public updateHighestScore(score: number) {
        if (this.highestScoreLabel) {
            this.highestScoreLabel.string = `最高：${score}`;
        }
    }
}
