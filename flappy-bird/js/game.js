/// <reference path="../typings/phaser/phaser.d.ts" />
var game=new Phaser.Game(288,505,Phaser.AUTO,'flappyBird');
game.States={};
game.States.boot=function(){
    this.preload=function(){
        if(!game.device.desktop){//移动设备
            this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
            this.scale.forcePortrait=true;
            this.scale.refresh();
        }
        game.load.image('loading','assets/preloader.gif');//加载进度条图片
    };
    this.create=function(){
        game.state.start('preload');
    }
};
game.States.preload=function(){
    this.preload=function(){
        var preloadSprite=game.add.sprite(35,game.height/2,'loading');
        game.load.setPreloadSprite(preloadSprite);
        //以下要加载的资源
        game.load.image('background','assets/background.png'); //游戏背景图
        game.load.image('ground','assets/ground.png'); //地面
        game.load.image('title','assets/title.png'); //游戏标题
        game.load.spritesheet('bird','assets/bird.png',34,24,3); //鸟
        game.load.image('btn','assets/start-button.png');  //按钮
        game.load.spritesheet('pipe','assets/pipes.png',54,320,2); //管道
        game.load.bitmapFont('flappy_font', 'assets/fonts/flappyfont/flappyfont.png', 'assets/fonts/flappyfont/flappyfont.fnt');//显示分数的字体
        game.load.audio('fly_sound', 'assets/flap.wav');//飞翔的音效
        game.load.audio('score_sound', 'assets/score.wav');//得分的音效
        game.load.audio('hit_pipe_sound', 'assets/pipe-hit.wav'); //撞击管道的音效
        game.load.audio('hit_ground_sound', 'assets/ouch.wav'); //撞击地面的音效

        game.load.image('ready_text','assets/get-ready.png'); //get ready图片
        game.load.image('play_tip','assets/instructions.png'); //玩法提示图片
        game.load.image('game_over','assets/gameover.png'); //gameover图片
        game.load.image('score_board','assets/scoreboard.png'); //得分板

    };
    this.create=function(){
        game.state.start('menu');
    }
};
game.States.menu=function(){
    this.create=function(){
        //背景与地面制作
        var bg=game.add.tileSprite(0,0,game.width,game.height,'background');
        var ground=game.add.tileSprite(0,game.height-112,game.width,112,'ground');
        bg.autoScroll(-10,0);
        ground.autoScroll(-100,0);
        //添加标题与鸟
        var titleGroup=game.add.group();
        titleGroup.create(0,0,'title');
        var bird=titleGroup.create(190,10,'bird');
        bird.animations.add('fly');
        bird.animations.play('fly',12,true);
        titleGroup.x=35;
        titleGroup.y=100;
        var titleGroupTween=game.add.tween(titleGroup)
        titleGroupTween.to({y:120},1000,null,true,0,-1,true);
        //添加开始游戏按钮
        var btn=game.add.button(game.width/2,game.height/2,'btn',function(){
            game.state.start('play');
        })
        btn.anchor.setTo(0.5,0.5);
    }
};
game.States.play=function(){
    this.create=function(){
        this.bg=game.add.tileSprite(0,0,game.width,game.height,'background');
        this.pipeGroup=game.add.group();//用于存放管道的组
        this.pipeGroup.enableBody=true;
        this.ground=game.add.tileSprite(0,game.height-112,game.width,112,'ground');
        //添加小鸟
        this.bird=game.add.sprite(50,150,'bird');
        this.bird.animations.add('fly');
        this.bird.animations.play('fly',12,true);
        this.bird.anchor.setTo(0.5,0.5);
        game.physics.enable(this.bird,Phaser.Physics.ARCADE);//开启小鸟的物理系统

        game.physics.enable(this.ground,Phaser.Physics.ARCADE);//开启地面的物理系统
        this.ground.body.immovable=true;//让地面在物理环境中固定不动

        this.readyText=game.add.image(game.width/2,40,'ready_text');//get ready文字
        this.playTip=game.add.image(game.width/2,300,'play_tip');//提示点击屏幕图片
        this.readyText.anchor.setTo(0.5,0.5);
        this.playTip.anchor.setTo(0.5,0.5);

        //声音资源的加载
        this.soundFly=game.add.audio('fly_sound',0.5);
        this.soundScore=game.add.audio('score_sound',0.5);
        this.soundHitPipe=game.add.audio('hit_pipe_sound',0.5);
        this.soundHitGround=game.add.audio('hit_ground_sound',0.5);

        this.hasStart=false;//标示游戏是否已开始
        game.time.events.loop(900,this.generatePipes,this);//循环事件产生管道
        game.time.events.stop(false);//先不要启动时钟
        game.input.onDown.addOnce(this.startGame,this);//点击屏幕后开始游戏
    }
    this.startGame=function(){
        this.gameSpeed=200;//游戏速度
        this.gameISOver=false;//游戏是否已结束
        this.hasHitGround=false;//是否已经硬撞到地面的标志
        this.hasStarted=true;//游戏是否已经开始标志
        this.score=0;//初始得分
        var style = { font: "65px Arial", fill: "#ff0044"};
        this.scoreText=game.add.text(10,10,this.score,style);

        this.bg.autoScroll(-(this.gameSpeed/10),0);//让背景开始移动
        this.ground.autoScroll(-this.gameSpeed,0);//让地面开始移动
        this.bird.body.gravity.y=1150;//给鸟设一重力
        this.readyText.destroy();//去除'get ready'图片
        this.playTip.destroy();//去除'玩法提示图片'
        game.input.onDown.add(this.fly,this);//给鼠标按一事件绑定鸟的飞翔动作
        game.time.events.start();//启动时钟事件，开始制程管道
    }
    this.stopGame=function(){//游戏结束处理逻辑
        this.bg.stopScroll();
        this.ground.stopScroll();
        this.pipeGroup.forEachExists(function(pipe){
            pipe.body.velocity.x=0;
        });
        this.bird.animations.stop('fly',0);
        game.input.onDown.remove(this.fly,this);
        game.time.events.stop(true);
    }
    //鸟飞的方法
    this.fly=function(){
        this.bird.body.velocity.y=-350;//飞翔，实质上就是给鸟设一个向上的速度
        game.add.tween(this.bird).to({angle:-30},100,null,true,0,0,false);//上午的时候鸟做一个旋转向上的动画
        this.soundFly.play();//播放飞翔的声音
    }
    //生成管道的方法
    this.generatePipes=function(gap){
        gap=gap || 100;//上下管道之间的间隙宽度
        var position=(505-320-gap)+Math.floor((505-112-30-gap-505+320+gap)*Math.random());//计算出一个上下管道之间的间隙的随机位置
        var topPipeY=position-360;//上方的管道
        var bottomPipeY=position+gap;//下方的管道
        
        if(this.resetPipe(topPipeY,bottomPipeY)) return;

        var topPipe=game.add.sprite(game.width,topPipeY,'pipe',0,this.pipeGroup);//上方的管道
        var bottomPipe=game.add.sprite(game.width,bottomPipeY,'pipe',1,this.pipeGroup);//下方的管道

        this.pipeGroup.setAll('checkWorldBounds',true);//边界检测
        this.pipeGroup.setAll('outOfBoundsKill',true);//出边界后自动kill
        this.pipeGroup.setAll('body.velocity.x',-this.gameSpeed);//设置管道动动的速度
    }
    //回收管道
    this.resetPipe=function(topPipeY,bottomPipey){
        var i=0;
        this.pipeGroup.forEachDead(function(pipe){
            if(pipe.y<=0){//上方管道
                pipe.reset(game.width,topPipeY);//重置到初始位置
                pipe.hasScored=false;//重置不得分
            }else{//下方管道
                pipe.reset(game.width,bottomPipey);//重置到初始位置
            }
            pipe.body.velocity.x=-this.gameSpeed;//设置管理的速度
            i++;
        },this);
        return i==2;//如果 i==2 代表有一组管道已经出了边界，可以回收这组管道了
    };
    this.update=function(){//每一帧中都要执行的代码可以写在update方法中
        if(!this.hasStarted) return;//游戏未开始，先不执行任何东西
        game.physics.arcade.collide(this.bird,this.ground,this.hitGround,null,this)//检测鸟与地面的碰撞
        game.physics.arcade.overlap(this.bird,this.pipeGroup,this.hitPipe,null,this)//检测鸟与管道的硬撞
        if(this.bird.angle<90) this.bird.angle+=2.5;//下降时鸟的头朝下
        this.pipeGroup.forEachExists(this.checkScore,this);//分数检测和更新
    }
    this.hitPipe=function(){//鸟撞到管道处理
        if(this.gameIsOver) return;
        this.soundHitPipe.play();
        this.gameOver();
    }
    this.hitGround=function(){//鸟撞到地面处理
        if(this.hasHitGround) return;
        this.hasHitGround=true;
        this.soundHitGround.play();
        this.gameOver(true);
    }
    this.gameOver=function(show_text){//游戏结束
        this.gameIsOver=true;
        this.stopGame();
        if(show_text) this.showGameOverText();
    }
    this.showGameOverText=function(){//显示游戏结结束与分数页面
        this.scoreText.destroy();
        game.bestScore=game.bestScore || 0;
        if(this.score>game.bestScore) game.bestScore=this.score;
        this.gameOverGroup=game.add.group();//添加一个组
        var gameOverText=this.gameOverGroup.create(game.width/2,0,'game_over');//组内加gameover图片
        var scoreboard=this.gameOverGroup.create(game.width/2,70,'score_board');//组内显示游戏得分板
        var currentScoreText=game.add.bitmapText(game.width/2+60,105,'flappy_font',this.score+'',20,this.gameOverGroup);//显示当前分数
        var bestScoreText=game.add.bitmapText(game.width/2+60,153,'flappy_font',game.bestScore,20,this.gameOverGroup);//显示最佳得分
        var replayBtn=game.add.button(game.width/2,210,'btn',function(){
            game.state.start('play');
        },this,null,null,null,null,this.gameOverGroup);//重新开始按钮
        gameOverText.anchor.setTo(0.5,0);
        scoreboard.anchor.setTo(0.5,0);
        replayBtn.anchor.setTo(0.5,0);
        this.gameOverGroup.y=30;
    }
    //统计分数
    this.checkScore=function(pipe){
        if(!pipe.hasScored && pipe.y<=0 && pipe.x<=this.bird.x+34){
            pipe.hasScored=true;
            this.scoreText.text=++this.score;
            this.soundScore.play();
            return true;
        }
        return false;
    }
};
//定义场景并添加场景到游戏中
game.state.add('boot',game.States.boot);
game.state.add('preload',game.States.preload);
game.state.add('menu',game.States.menu);
game.state.add('play',game.States.play);

game.state.start('boot');//首先开始加载进度条场景