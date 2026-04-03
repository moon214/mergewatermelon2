/**
 * 合成大西瓜 - 抖音小游戏
 * 
 * 游戏入口文件
 */

import Game from './js/main.js';

// 游戏实例
let game = null;

// 游戏启动
tt.onShow((options) => {
  console.log('游戏启动', options);
  
  if (!game) {
    game = new Game();
    game.start();
  }
});

// 游戏隐藏
tt.onHide(() => {
  console.log('游戏隐藏');
  if (game) {
    game.pause();
  }
});

// 游戏销毁
tt.onDestroy(() => {
  console.log('游戏销毁');
  if (game) {
    game.destroy();
  }
});
