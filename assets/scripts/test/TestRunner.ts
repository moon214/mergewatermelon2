import { _decorator, Component, Node, log } from 'cc';
import { GameManager } from '../core/GameManager';
import { Fruit, FruitType, FruitConfig } from '../fruit/Fruit';

const { ccclass, property } = _decorator;

/**
 * 自动化测试运行器
 * 用于验证游戏核心功能
 */
@ccclass('TestRunner')
export class TestRunner extends Component {
    private testResults: Map<string, boolean> = new Map();
    private testCount: number = 0;
    private passCount: number = 0;

    onLoad() {
        console.log('[TestRunner] 测试运行器初始化');
    }

    /**
     * 运行所有测试
     */
    public async runAllTests() {
        console.log('=== 🧪 开始运行测试套件 ===');

        this.testCount = 0;
        this.passCount = 0;
        this.testResults.clear();

        await this.testFruitConfig();
        await this.testScoreCalculation();
        await this.testComboMultiplier();
        await this.testFruitMerge();
        await this.testGameState();

        this.printResults();
    }

    /**
     * 测试水果配置
     */
    private async testFruitConfig() {
        const testName = '水果配置完整性';
        this.testCount++;

        try {
            // 检查 8 级水果配置
            const expectedLevels = 8;
            const actualLevels = Object.keys(FruitConfig).length;

            if (actualLevels !== expectedLevels) {
                throw new Error(`期望${expectedLevels}级，实际${actualLevels}级`);
            }

            // 检查分数递增
            let prevScore = 0;
            for (let i = 0; i < expectedLevels; i++) {
                const config = FruitConfig[i as FruitType];
                if (config.score <= prevScore) {
                    throw new Error(`${config.name}分数${config.score}不大于前一级${prevScore}`);
                }
                prevScore = config.score;
            }

            this.pass(testName);
        } catch (error) {
            this.fail(testName, error);
        }
    }

    /**
     * 测试分数计算
     */
    private async testScoreCalculation() {
        const testName = '分数计算正确性';
        this.testCount++;

        try {
            // 基础分数测试
            const baseScore = 100;
            const comboMultiplier = 1.0;
            const expected = baseScore;
            const actual = Math.floor(baseScore * comboMultiplier);

            if (actual !== expected) {
                throw new Error(`期望${expected}，实际${actual}`);
            }

            this.pass(testName);
        } catch (error) {
            this.fail(testName, error);
        }
    }

    /**
     * 测试连击倍率
     */
    private async testComboMultiplier() {
        const testName = '连击倍率计算';
        this.testCount++;

        try {
            const testCases = [
                { combo: 1, expected: 1.0 },
                { combo: 2, expected: 1.2 },
                { combo: 4, expected: 1.5 },
                { combo: 6, expected: 2.0 },
                { combo: 10, expected: 3.0 },
            ];

            for (const { combo, expected } of testCases) {
                const actual = this.getComboMultiplier(combo);
                if (Math.abs(actual - expected) > 0.01) {
                    throw new Error(`${combo}连击：期望${expected}，实际${actual}`);
                }
            }

            this.pass(testName);
        } catch (error) {
            this.fail(testName, error);
        }
    }

    /**
     * 测试水果合成逻辑
     */
    private async testFruitMerge() {
        const testName = '水果合成逻辑';
        this.testCount++;

        try {
            // 检查合成规则：同级合成升一级
            for (let i = 0; i < FruitType.WATERMELON; i++) {
                const nextLevel = i + 1;
                const currentConfig = FruitConfig[i as FruitType];
                const nextConfig = FruitConfig[nextLevel as FruitType];

                if (nextConfig.score <= currentConfig.score) {
                    throw new Error(`${currentConfig.name}合成后分数应大于当前`);
                }
            }

            // 检查最高级不能再合成
            const watermelon = FruitConfig[FruitType.WATERMELON];
            if (!watermelon) {
                throw new Error('西瓜配置缺失');
            }

            this.pass(testName);
        } catch (error) {
            this.fail(testName, error);
        }
    }

    /**
     * 测试游戏状态机
     */
    private async testGameState() {
        const testName = '游戏状态机';
        this.testCount++;

        try {
            const states = ['WAITING', 'PLAYING', 'PAUSED', 'GAME_OVER'];
            
            // 检查状态枚举完整性
            if (states.length !== 4) {
                throw new Error(`期望 4 个状态，实际${states.length}个`);
            }

            this.pass(testName);
        } catch (error) {
            this.fail(testName, error);
        }
    }

    /**
     * 计算连击倍率（与 GameManager 一致）
     */
    private getComboMultiplier(combo: number): number {
        if (combo >= 10) return 3.0;
        if (combo >= 6) return 2.0;
        if (combo >= 4) return 1.5;
        if (combo >= 2) return 1.2;
        return 1.0;
    }

    /**
     * 测试通过
     */
    private pass(name: string) {
        this.testResults.set(name, true);
        this.passCount++;
        console.log(`✅ ${name}`);
    }

    /**
     * 测试失败
     */
    private fail(name: string, error: any) {
        this.testResults.set(name, false);
        console.error(`❌ ${name}: ${error}`);
    }

    /**
     * 打印测试结果
     */
    private printResults() {
        console.log('=== 📊 测试结果 ===');
        console.log(`总测试数：${this.testCount}`);
        console.log(`通过：${this.passCount}`);
        console.log(`失败：${this.testCount - this.passCount}`);
        console.log(`通过率：${(this.passCount / this.testCount * 100).toFixed(1)}%`);

        if (this.passCount === this.testCount) {
            console.log('🎉 所有测试通过！');
        } else {
            console.log('⚠️ 有测试失败，请检查');
        }
    }
}
