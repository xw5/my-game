/*
 * @Author: xw 
 * @Date: 2017-03-03 14:25:28 
 * @Last Modified by: xw
 * @Last Modified time: 2017-03-03 16:05:21
 */
/// <reference path="../typings/phaser/phaser.d.ts" />
var Candy={};

Candy.Boot=function(){};
Candy.Boot.prototype={
    preload:function(){
        this.load.image('preloaderBar','../assets/loading-bar.png');
    },
    create:function(){
        //游戏设置与适配
        this.input.maxPointers=1;//单点触控
        this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignVertically=true;//垂直居中
        this.scale.pageAlignHorizontally=true;//水平居中
        //this.scale.setScreenSize(true);//允许缩放
        this.state.start('Preloader');//启动加载资源场景
    }
}
