import { _decorator, Component } from 'cc';
import { GameManager } from '../core/GameManager';
import { DouyinSDK } from '../platform/DouyinSDK';

const { ccclass, property } = _decorator;

export enum AdType {
    REWARDED_VIDEO = 1,
    INTERSTITIAL = 2,
    BANNER = 3,
}

export const AdUnitConfig = {
    rewarded: {
        normal: 'ad_unit_rewarded_normal',
        double: 'ad_unit_rewarded_double',
        revive: 'ad_unit_rewarded_revive',
        prop: 'ad_unit_rewarded_prop',
    },
    interstitial: {
        gameover: 'ad_unit_interstitial_gameover',
        interval: 'ad_unit_interstitial_interval',
    },
    banner: {
        bottom: 'ad_unit_banner_bottom',
    },
};

@ccclass('AdManager')
export class AdManager extends Component {
    private douyinSDK: DouyinSDK = null!;
    private isAdLoading: boolean = false;
    private isAdShowing: boolean = false;
    private lastAdTime: number = 0;
    private adCooldown: number = 30000;
    private dailyAdCount: number = 0;
    private dailyAdLimit: number = 50;

    onLoad() {
        this.douyinSDK = GameManager.instance.douyinSDK;
        this.loadDailyAdCount();
        console.log('[AdManager] 初始化完成');
    }

    private loadDailyAdCount() {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('adDate');
        const savedCount = localStorage.getItem('adCount');

        if (savedDate !== today) {
            this.dailyAdCount = 0;
            localStorage.setItem('adDate', today);
            localStorage.setItem('adCount', '0');
        } else if (savedCount) {
            this.dailyAdCount = parseInt(savedCount);
        }
    }

    private incrementAdCount() {
        this.dailyAdCount++;
        localStorage.setItem('adCount', this.dailyAdCount.toString());
    }

    private canShowAd(): boolean {
        const now = Date.now();
        if (now - this.lastAdTime < this.adCooldown) {
            return false;
        }
        if (this.dailyAdCount >= this.dailyAdLimit) {
            return false;
        }
        if (this.isAdShowing) {
            return false;
        }
        return true;
    }

    public async showRewardedAd(
        adUnitId: string = AdUnitConfig.rewarded.normal,
        onReward?: (success: boolean) => void
    ): Promise<boolean> {
        if (!this.canShowAd()) {
            return false;
        }

        console.log('[AdManager] 展示激励视频:', adUnitId);
        this.isAdShowing = true;

        try {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                console.log('[AdManager] 模拟广告展示（非抖音环境）');
                await this.simulateRewardedAd(onReward);
                return true;
            }

            // @ts-ignore
            const rewardedVideoAd = tt.createRewardedVideoAd({ adUnitId });

            rewardedVideoAd.on('close', (res: any) => {
                this.isAdShowing = false;
                this.lastAdTime = Date.now();

                if (res && res.isEnded) {
                    console.log('[AdManager] 广告观看完成，发放奖励');
                    this.incrementAdCount();
                    if (onReward) onReward(true);
                } else {
                    if (onReward) onReward(false);
                }
            });

            rewardedVideoAd.on('error', (err: any) => {
                this.isAdShowing = false;
                console.error('[AdManager] 广告错误:', err);
                if (onReward) onReward(false);
            });

            await rewardedVideoAd.load();
            await rewardedVideoAd.show();

            return true;
        } catch (error) {
            this.isAdShowing = false;
            console.error('[AdManager] 广告展示失败:', error);
            return false;
        }
    }

    private async simulateRewardedAd(onReward?: (success: boolean) => void): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isAdShowing = false;
                this.lastAdTime = Date.now();
                this.incrementAdCount();
                console.log('[AdManager] 模拟广告完成');
                if (onReward) onReward(true);
                resolve();
            }, 5000);
        });
    }

    public async showInterstitialAd(adUnitId: string = AdUnitConfig.interstitial.gameover): Promise<boolean> {
        if (!this.canShowAd()) {
            return false;
        }

        console.log('[AdManager] 展示插屏广告:', adUnitId);
        this.isAdShowing = true;

        try {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                console.log('[AdManager] 模拟插屏广告');
                await this.simulateInterstitialAd();
                return true;
            }

            // @ts-ignore
            const interstitialAd = tt.createInterstitialAd({ adUnitId });

            interstitialAd.on('load', () => {
                interstitialAd.show();
            });

            interstitialAd.on('close', () => {
                this.isAdShowing = false;
                this.lastAdTime = Date.now();
                this.incrementAdCount();
            });

            await interstitialAd.load();

            return true;
        } catch (error) {
            this.isAdShowing = false;
            console.error('[AdManager] 插屏广告失败:', error);
            return false;
        }
    }

    private async simulateInterstitialAd(): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.isAdShowing = false;
                this.lastAdTime = Date.now();
                this.incrementAdCount();
                console.log('[AdManager] 模拟插屏广告完成');
                resolve();
            }, 3000);
        });
    }

    public async showBannerAd(adUnitId: string = AdUnitConfig.banner.bottom, show: boolean = true): Promise<boolean> {
        console.log('[AdManager] Banner 广告:', show ? '显示' : '隐藏');

        try {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                return true;
            }

            // @ts-ignore
            const bannerAd = tt.createBannerAd({
                adUnitId,
                style: {
                    left: 0,
                    top: 0,
                    width: 300,
                },
            });

            if (show) {
                await bannerAd.show();
            } else {
                await bannerAd.hide();
            }

            return true;
        } catch (error) {
            console.error('[AdManager] Banner 广告失败:', error);
            return false;
        }
    }

    public getDailyAdCount(): number {
        return this.dailyAdCount;
    }

    public getRemainingAds(): number {
        return Math.max(0, this.dailyAdLimit - this.dailyAdCount);
    }
}
