/*
 * @Author: xw 
 * @Date: 2017-03-03 14:54:59 
 * @Last Modified by: xw
 * @Last Modified time: 2017-03-03 17:44:59
 */
/// <reference path="../typings/phaser/phaser.d.ts" />

Candy.Preloader=function(game){
    Candy.GAME_WIDTH=640;
    Candy.GAME_HEIGHT=960;
};
Candy.Preloader.prototype={
    preload:function(){
        this.state.backgroundColor='#b4d9e7';
        this.preloader=this.add.sprite((Candy.GAME_WIDTH-311)/2,(Candy.GAME_HEIGHT-27)/2,'preloaderBar');
        this.load.setPreloadSprite(this.preloader);
        //加载资源
        this.load.image('background','../assets/background.png');
        this.load.image('floor','../assets/floor.png');
        this.load.image('monster-cover','../assets/monster-cover.png');
        this.load.image('title','../assets/title.png');
        this.load.image('game-over','../assets/gameover.png');
        this.load.image('score-bg','../assets/score-bg.png');
        this.load.image('button-pause','../assets/button-pause.png');
        this.load.image('reset-btn','../assets/restart-button.png');

        this.load.spritesheet('candy','../assets/candy.png',82,98);//加载糖果精灵图
        this.load.spritesheet('monster-idle','../assets/monster-idle.png',103,131);//加载怪物精灵图
        this.load.spritesheet('button-start','../assets/button-start.png',401,143);//加载按钮精录

        this.load.bitmapFont('candy_font','../assets/fonts/candyfont.png','../assets/fonts/candyfont.fnt');//显示分数的字体

    },
    create:function(){
        this.state.start('MainMenu');
    }
}