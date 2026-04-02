import { _decorator, Component, sys } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 抖音小程序 SDK 封装
 */
@ccclass('DouyinSDK')
export class DouyinSDK extends Component {
    private isInitialized: boolean = false;

    public init() {
        if (this.isInitialized) {
            return;
        }

        const isDouyin = sys.platform === sys.DOUYIN_MINI_GAME;
        console.log(`[DouyinSDK] 初始化 - 抖音环境：${isDouyin}`);
        this.isInitialized = true;
    }

    public async login(): Promise<{ success: boolean; userInfo?: any }> {
        return new Promise((resolve) => {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                console.warn('[DouyinSDK] 不在抖音环境，使用模拟登录');
                resolve({
                    success: true,
                    userInfo: { nickname: '游客', avatar: '' },
                });
                return;
            }

            // @ts-ignore
            tt.login({
                success: (res: any) => {
                    console.log('[DouyinSDK] 登录成功', res);
                    this.getUserProfile().then(userInfo => {
                        resolve({ success: true, userInfo });
                    });
                },
                fail: (err: any) => {
                    console.error('[DouyinSDK] 登录失败', err);
                    resolve({ success: false });
                },
            });
        });
    }

    public async getUserProfile(): Promise<any> {
        return new Promise((resolve) => {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                resolve({ nickname: '游客', avatar: '' });
                return;
            }

            // @ts-ignore
            tt.getUserProfile({
                success: (res: any) => {
                    resolve(res.userInfo);
                },
                fail: () => {
                    resolve({ nickname: '游客', avatar: '' });
                },
            });
        });
    }

    public async shareToVideo(options: {
        title?: string;
        imageUrl?: string;
        query?: string;
    }): Promise<{ success: boolean }> {
        return new Promise((resolve) => {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                console.log('[DouyinSDK] 模拟分享');
                resolve({ success: true });
                return;
            }

            // @ts-ignore
            tt.shareToVideo({
                templateKey: 'game_score',
                templateData: {
                    score: options.title || '来看看我的分数！',
                },
                query: options.query || '',
                success: () => {
                    console.log('[DouyinSDK] 分享成功');
                    resolve({ success: true });
                },
                fail: (err: any) => {
                    console.error('[DouyinSDK] 分享失败', err);
                    resolve({ success: false });
                },
            });
        });
    }

    public async saveCloudStorage(key: string, value: string): Promise<boolean> {
        return new Promise((resolve) => {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                localStorage.setItem(key, value);
                resolve(true);
                return;
            }

            // @ts-ignore
            tt.cloudStorage.setUserCloudStorage({
                kvList: [{ key, value }],
                success: () => {
                    console.log(`[DouyinSDK] 云存储保存成功：${key}`);
                    resolve(true);
                },
                fail: (err: any) => {
                    console.error('[DouyinSDK] 云存储失败', err);
                    resolve(false);
                },
            });
        });
    }

    public async loadCloudStorage(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            // @ts-ignore
            if (typeof tt === 'undefined') {
                resolve(localStorage.getItem(key));
                return;
            }

            // @ts-ignore
            tt.cloudStorage.getUserCloudStorage({
                keyList: [key],
                success: (res: any) => {
                    const kv = res.kvList.find((item: any) => item.key === key);
                    resolve(kv ? kv.value : null);
                },
                fail: () => {
                    resolve(null);
                },
            });
        });
    }
}
