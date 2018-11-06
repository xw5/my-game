/*
 * @Author: xw 
 * @Date: 2017-03-03 16:06:01 
 * @Last Modified by: xw
 * @Last Modified time: 2017-03-03 18:15:52
 */
/// <reference path="../typings/phaser/phaser.d.ts" />

//主游戏场景
Candy.Game=function(game){
    this._player=null;
    this._spawnCandyTimer=0;
    this._fontStyle=null;
    Candy._candyGroup=null;
    Candy._scoreText=null;
    Candy._score=0;
    Candy._health=0;
}
Candy.Game.prototype={
    create:function(){
        this.gameOver=false;//游戏是否结束
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y=200;

        this.add.sprite(0,0,'background');
        this.add.sprite(-30,Candy.GAME_HEIGHT-160,'floor');
        this.add.sprite(10,5,'score-bg');
        this.add.button(Candy.GAME_WIDTH-96-10,5,'button-pause',this.managePause,this);

        this._player=this.add.sprite(5,760,'monster-idle');
        this._player.animations.add('idle',[0,1,2,3,4,5,6,7,8,9,10,11,12],10,true);
        this._player.animations.play('idle');

        this._spawnCandyTimer=0;
        Candy._health=10;

        Candy._scoreText=this.add.bitmapText(120,20,'candy_font','0',40);

        Candy._candyGroup=this.add.group();
        Candy.item.spawnCandy(this);

        
    },
    update:function(){
        if(!Candy._health){//如果没生命了就直接暂停游戏,显示game-over
            if(!this.gameOver){
                this.gameOver=true;
                this.add.sprite((Candy.GAME_WIDTH-594)/2,(Candy.GAME_HEIGHT-418)/2,'game-over');
                var resetBtn=this.add.button(Candy.GAME_WIDTH/2,(Candy.GAME_HEIGHT/2+60),'reset-btn',function(){
                    this.state.start('Game');
                },this);
                resetBtn.anchor.setTo(0.5,0);
                Candy._candyGroup.destroy();
            }
            return;
        }
        this._spawnCandyTimer+=this.time.elapsed;
        if(this._spawnCandyTimer>1000){//间隔生成一糖果
            this._spawnCandyTimer=0;
            Candy.item.spawnCandy(this);
        }
        Candy._candyGroup.forEach(function(candy){//糖果自身旋转
            candy.angle+=candy.rotateMe;
        })
    },
    managePause:function(){
        this.game.paused=true;
        var pauseStyle={
            font:'40px Arial',
            fill:'#fff',
            stroke:'yellow',
            strokeThinkness:3,
            align:'center',
            shadow:'0 0 10px #000'
        }
        var pauseText=this.add.text(100,250,"Game paused.\nTap anywhere to continue",pauseStyle);
        this.input.onDown.add(function(){
            pauseText.destroy();
            this.game.paused=false;
        })
    }
}
//糖果对象
Candy.item={
    spawnCandy:function(){//生成一个糖果
        var dropPos=Math.floor(Math.random()*Candy.GAME_WIDTH);
        var dropOffset=[-27,-36,-36,-38,-48];
        var candyType=Math.floor(Math.random()*5);
        var candy=game.add.sprite(dropPos,dropOffset[candyType],'candy');
        candy.animations.add('anim',[candyType],10,true);

        game.physics.enable(candy,Phaser.Physics.ARCADE);
        candy.inputEnabled=true;
        candy.events.onInputDown.add(this.clickCandy,this);

        candy.checkWorldBounds=true;
        candy.events.onOutOfBounds.add(this.removeCandy,this);
        candy.anchor.setTo(0.5,0.5);
        candy.rotateMe=Math.random()*4-2;
        Candy._candyGroup.add(candy);
    },
    clickCandy:function(candy){//点击糖果的时候执行
        candy.kill();
        Candy._score+=1;
        Candy._scoreText.setText(Candy._score);
    },
    removeCandy:function(candy){//糖果超出边界
        candy.kill();
        Candy._health-=10;
    }
}