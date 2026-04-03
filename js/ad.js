/**
 * 广告系统 - 穿山甲广告集成
 */

export default class Ad {
  constructor() {
    this.isAdShowing = false;
    this.lastAdTime = 0;
    this.adCooldown = 30000; // 30 秒冷却
    
    // 广告位 ID（需要替换为你的实际广告位 ID）
    this.adUnitIds = {
      rewarded: 'ad_unit_rewarded_normal',  // 激励视频
      interstitial: 'ad_unit_interstitial_gameover',  // 插屏广告
      banner: 'ad_unit_banner_bottom',  // Banner 广告
    };
  }

  // 显示激励视频广告
  async showRewardedAd(onReward) {
    if (this.isAdShowing) {
      console.log('广告正在显示，跳过');
      return false;
    }

    console.log('显示激励视频广告');

    try {
      // 检查是否在抖音环境
      if (typeof tt === 'undefined') {
        console.log('模拟激励视频广告（非抖音环境）');
        await this.simulateRewardedAd(onReward);
        return true;
      }

      const rewardedVideoAd = tt.createRewardedVideoAd({
        adUnitId: this.adUnitIds.rewarded,
      });

      return new Promise((resolve) => {
        rewardedVideoAd.on('close', () => {
          this.isAdShowing = false;
          this.lastAdTime = Date.now();

          if (rewardedVideoAd.videoEnded) {
            console.log('广告观看完成，发放奖励');
            if (onReward) onReward(true);
            resolve(true);
          } else {
            console.log('广告未看完');
            if (onReward) onReward(false);
            resolve(false);
          }
        });

        rewardedVideoAd.on('error', (err) => {
          this.isAdShowing = false;
          console.error('广告错误:', err);
          if (onReward) onReward(false);
          resolve(false);
        });

        rewardedVideoAd.load().then(() => {
          rewardedVideoAd.show().catch((err) => {
            console.error('广告显示失败:', err);
            this.isAdShowing = false;
            resolve(false);
          });
        }).catch((err) => {
          console.error('广告加载失败:', err);
          this.isAdShowing = false;
          resolve(false);
        });
      });
    } catch (error) {
      this.isAdShowing = false;
      console.error('广告展示失败:', error);
      return false;
    }
  }

  // 显示插屏广告
  async showInterstitialAd() {
    const now = Date.now();
    if (now - this.lastAdTime < this.adCooldown) {
      console.log('广告冷却中，跳过');
      return false;
    }

    if (this.isAdShowing) {
      return false;
    }

    console.log('显示插屏广告');

    try {
      if (typeof tt === 'undefined') {
        console.log('模拟插屏广告（非抖音环境）');
        await this.simulateInterstitialAd();
        return true;
      }

      const interstitialAd = tt.createInterstitialAd({
        adUnitId: this.adUnitIds.interstitial,
      });

      return new Promise((resolve) => {
        interstitialAd.on('load', () => {
          interstitialAd.show().catch((err) => {
            console.error('插屏广告显示失败:', err);
            this.isAdShowing = false;
            resolve(false);
          });
        });

        interstitialAd.on('close', () => {
          this.isAdShowing = false;
          this.lastAdTime = Date.now();
          console.log('插屏广告关闭');
          resolve(true);
        });

        interstitialAd.on('error', (err) => {
          this.isAdShowing = false;
          console.error('插屏广告错误:', err);
          resolve(false);
        });

        interstitialAd.load().catch((err) => {
          console.error('插屏广告加载失败:', err);
          this.isAdShowing = false;
          resolve(false);
        });

        this.isAdShowing = true;
      });
    } catch (error) {
      this.isAdShowing = false;
      console.error('插屏广告失败:', error);
      return false;
    }
  }

  // 显示 Banner 广告
  async showBannerAd(show = true) {
    console.log('Banner 广告:', show ? '显示' : '隐藏');

    try {
      if (typeof tt === 'undefined') {
        return true;
      }

      const bannerAd = tt.createBannerAd({
        adUnitId: this.adUnitIds.banner,
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
      console.error('Banner 广告失败:', error);
      return false;
    }
  }

  // 模拟激励视频广告（开发环境）
  async simulateRewardedAd(onReward) {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isAdShowing = false;
        this.lastAdTime = Date.now();
        console.log('模拟激励视频广告完成');
        if (onReward) onReward(true);
        resolve(true);
      }, 5000);
    });
  }

  // 模拟插屏广告（开发环境）
  async simulateInterstitialAd() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isAdShowing = false;
        this.lastAdTime = Date.now();
        console.log('模拟插屏广告完成');
        resolve(true);
      }, 3000);
    });
  }

  // 获取每日广告次数
  getDailyAdCount() {
    const today = new Date().toDateString();
    const savedDate = tt.getStorageSync('adDate');
    const savedCount = tt.getStorageSync('adCount') || 0;

    if (savedDate !== today) {
      tt.setStorageSync('adDate', today);
      tt.setStorageSync('adCount', 0);
      return 0;
    }

    return savedCount;
  }

  // 增加广告计数
  incrementAdCount() {
    const count = this.getDailyAdCount() + 1;
    tt.setStorageSync('adCount', count);
  }
}
