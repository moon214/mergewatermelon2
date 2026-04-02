import { _decorator, Component, Node, Label, Button, Sprite } from 'cc';
import { PropType, PropConfig } from './PropManager';
import { GameManager } from '../core/GameManager';

const { ccclass, property } = _decorator;

/**
 * 道具物品 UI
 */
@ccclass('PropItem')
export class PropItem extends Component {
    @property(Label)
    nameLabel: Label = null!;

    @property(Label)
    countLabel: Label = null!;

    @property(Button)
    useButton: Button = null!;

    private propType: PropType = PropType.BOMB;

    onLoad() {
        this.useButton.clickEvents.push(this.createClickEvent('onUseClick'));
        console.log('[PropItem] 初始化完成');
    }

    /**
     * 设置道具信息
     */
    public setPropData(type: PropType, count: number) {
        this.propType = type;
        const config = PropConfig[type];

        if (this.nameLabel) {
            this.nameLabel.string = `${config.icon} ${config.name}`;
        }

        if (this.countLabel) {
            this.countLabel.string = `x${count}`;
        }

        // 道具不足时禁用按钮
        this.useButton.interactable = count > 0;

        console.log(`[PropItem] 设置道具：${config.name} x${count}`);
    }

    /**
     * 更新数量显示
     */
    public updateCount(count: number) {
        if (this.countLabel) {
            this.countLabel.string = `x${count}`;
        }
        this.useButton.interactable = count > 0;
    }

    /**
     * 使用道具
     */
    public async onUseClick() {
        const propManager = GameManager.instance.getComponentInChildren(PropManager);
        if (!propManager) {
            console.error('[PropItem] 未找到 PropManager');
            return;
        }

        const success = await propManager.useProp(this.propType);
        if (success) {
            console.log(`[PropItem] 使用道具成功：${PropConfig[this.propType].name}`);
        } else {
            console.log('[PropItem] 使用道具失败');
        }
    }

    /**
     * 观看广告获取道具
     */
    public async watchAdAndGet() {
        const propManager = GameManager.instance.getComponentInChildren(PropManager);
        if (!propManager) return;

        const config = PropConfig[this.propType];
        console.log(`[PropItem] 观看广告获取 ${config.name}，需要${config.adCount}次`);

        // TODO: 调用广告 SDK
    }

    private createClickEvent(handler: string) {
        // @ts-ignore
        const event = new Component.EventHandler();
        event.target = this.node;
        event.component = 'PropItem';
        event.handler = handler;
        return event;
    }
}
