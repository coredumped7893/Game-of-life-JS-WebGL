var GameState;
var Interval = 35;
var wgl;
var gen=0;
$(document).ready(function(){
    GameState = new GameState();
    GameState.init();
    GameMain.start();
});
function getBrowser(){
    // Opera 8.0+
    var out = [];
    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    out.push(isOpera);
    // Firefox 1.0+
    var isFirefox = typeof InstallTrigger !== 'undefined';
    out.push(isFirefox);
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);
    out.push(isSafari);
    // Internet Explorer 6-11
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    out.push(isIE);
    // Edge 20+
    var isEdge = !isIE && !!window.StyleMedia;
    out.push(isEdge);
    // Chrome 1+
    var isChrome = !!window.chrome && !!window.chrome.webstore;
    out.push(isChrome);
    // Blink engine detection
    var isBlink = (isChrome || isOpera) && !!window.CSS;
    out.push(isBlink);
    return out;
}
function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
}
var GameMain = {
    canvas: document.getElementById("canvas"),
    main: document.getElementById("main"),
    start:function(){
        this.panel = canvas.getContext("2d");
        this.main = main.getContext("2d");
         GameMain.panel.fillStyle= 'rgba(111,164,234,1)';
     //  this.interval = setInterval(updateG, Interval);
        updateG();
        console.log("STARTED");
    },
    stop:function(){
         clearInterval(this.interval);
    },
    clear:function(){
         this.panel.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
function Swap(x,y){
  if( GameState.nextState[x][y]>=1){
            GameState.nextState[x][y]=0;
        }else{
            GameState.nextState[x][y]=1;
        }
        return GameState.nextState[x][y];
}
var changeH=new Array((GameState.w/GameState.cellSize*GameState.w/GameState.cellSize).toFixed(0));
var iter2=0;
var alive=0;
function GameState(){
    this.currentState = [];
    this.nextState = [];
    this.cellSize=10;
    this.bro ;
    this.ageColorEnable=false;
    this.showBenchmark=true;
    this.w = window.innerWidth;
    this.h = window.innerHeight;
     console.log(this.w/this.cellSize);
     console.log(this.h/this.cellSize);
    this.updateGUI = function(){
        if(wgl.supported){
            alive = changeH.length/2;
            wgl.drawArray(changeH);
            changeH.length=0;
            iter2=0;
            return true;
        }else{
            this.nextState.forEach(function(el,index){
                if(typeof el !="undefined"){
                    el.forEach(function(elI,inner_index){
                        if( typeof elI !='undefined'){
                            var column = index;
                            var row = inner_index;
                            var state=GameState.nextState[column][row];   
                             if(state!=GameState.currentState[column][row]){
                                 if(!GameState.bro[1] || 1==1){
                                    GameState.cellSize= 5;
                                     GameState.drawCell(column,row,state);  
                                      GameState.currentState[column][row]=GameState.nextState[column][row]; 
                                 }      
                             }
                        }     
                    });        
                }    
        });
        }
       //  GameMain.main.clearRect(0, 0, GameMain.canvas.width, GameMain.canvas.height);
      //   GameMain.main.drawImage(GameMain.canvas,0,0);
    }
    this.ageColor = function(age){
       age=age/2;
        if(age>1){
            age=1;
        }
        GameMain.panel.fillStyle = 'rgba(111,164,234,'+(age)+')';
    }
    this.getColor = function(){
        return (Math.random()*100)%7;
    }
    this.calculate = function(){
          for(var i =1;i<(this.w/this.cellSize);i++){
            for(var j=1;j<(this.h/this.cellSize);j++){
               var nei=0;
               
                if(this.currentState[i][j-1]>=1 ){
                    nei++;
                } if(this.currentState[i+1][j]>=1 ){
                    nei++;
                } if(this.currentState[i+1][j+1]>=1){
                    nei++;
                } if(this.currentState[i][j+1]>=1){
                    nei++;
                } if(this.currentState[i-1][j+1]>=1 ){
                    nei++;
                } if(this.currentState[i-1][j]>=1 ){
                    nei++;
                } if(this.currentState[i-1][j-1]>=1  ){
                    nei++;
                } if(this.currentState[i+1][j-1]>=1){
                    nei++;
                }
                if(this.currentState[i][j]>=1){   
                    if(nei<2 || nei >3){
                        this.nextState[i][j]=0;   
                    } if(nei===2 || nei===3){
                        this.nextState[i][j]++;
                        changeH[iter2]=(i*this.cellSize+0.5);
                        changeH[iter2+1]=(j*this.cellSize+0.5);
                        iter2+=2;
                        gen++;
                    }
                } if(this.currentState[i][j]===0){
                     if(nei===3){
                        this.nextState[i][j]=1;
                         changeH[iter2]=(i*this.cellSize+0.5);
                         changeH[iter2+1]=(j*this.cellSize+0.5);
                         iter2+=2;
                         gen++;
                    }else{
                        this.nextState[i][j]=0;
                    }
                }
        }   
    }
        if(wgl.supported){
             for(var i =1;i<(this.w/this.cellSize);i++){
                for(var j=1;j<(this.h/this.cellSize);j++){
                     GameState.currentState[i][j]=GameState.nextState[i][j]; 
                }
              } 
        }
          gen++;
    }
    this.init = function(){
        //
            wgl = new WGL(FULL_PAGE_CANVAS.mount());//using plugin full-page-canvas
            wgl.setPixelSize(this.cellSize+0);
            wgl.setShader("vertexSource.s",1);
            wgl.setShader("fragmentSource.s",0);
            wgl.init();
           // wgl.setFillColor(new Color(111,164,234,1),'u_color');
            wgl.setFillColor(new Color(91,235,161,1),'u_color');
            wgl.setClearColor(new Color(83,89,97,1));
            wgl.setAttribute("coordinates",2,wgl.gl.FLOAT, false, 0, 0 );
            wgl.setUniform('u_resolution','vec2',[wgl.canvas.width,wgl.canvas.height]);
          //  wgl.drawPixel(5,5);
        this.bro=getBrowser();
       for( i =0;i<=(this.w/this.cellSize)+1;i++){
            this.currentState[i]= new Array((this.w/this.cellSize+1).toFixed(0));
            this.nextState[i]= new Array((this.w/this.cellSize+1).toFixed(0));
            for( j=0;j<=(this.h/this.cellSize)+1;j++){
                 this.nextState[i][j] =0;
                 this.currentState[i][j] =0;
            }
        }
        this.randomInit();//turn this off to disable random seed at zero state
        //draws periodical structure
        
        /*
        this.currentState[5][8]=2;
        this.currentState[6][8]=2;
        this.currentState[7][8]=2;
        this.currentState[5][9]=2;
        this.currentState[7][9]=2;
        this.currentState[5][10]=2;
        this.currentState[6][10]=2;
        this.currentState[7][10]=2;
        this.currentState[5][11]=2;
        this.currentState[6][11]=2;
        this.currentState[7][11]=2;
        this.currentState[5][12]=2;
        this.currentState[6][12]=2;
        this.currentState[7][12]=2;
        this.currentState[5][13]=2;
        this.currentState[6][13]=2;
        this.currentState[7][13]=2;
        this.currentState[7][14]=2;
        this.currentState[5][14]=2;
        this.currentState[5][15]=2;
        this.currentState[6][15]=2;
        this.currentState[7][15]=2;
        */
        /*
        var b=90;
         this.currentState[b+30][100]=2;
         this.currentState[b+31][100]=2;
         this.currentState[b+32][100]=2;
         this.currentState[b+33][100]=2;
         this.currentState[b+34][100]=2;
         this.currentState[b+35][100]=2;
         this.currentState[b+36][100]=2;
         this.currentState[b+37][100]=2;
        
         this.currentState[b+39][100]=2;
         this.currentState[b+40][100]=2;
         this.currentState[b+41][100]=2;
         this.currentState[b+42][100]=2;
         this.currentState[b+43][100]=2;
        
         this.currentState[b+47][100]=2;
         this.currentState[b+48][100]=2;
         this.currentState[b+49][100]=2;
        
         this.currentState[b+56][100]=2;
         this.currentState[b+57][100]=2;
         this.currentState[b+58][100]=2;
         this.currentState[b+59][100]=2;
         this.currentState[b+60][100]=2;
         this.currentState[b+61][100]=2;
         this.currentState[b+62][100]=2;
        
        
        
        var a=this.h/this.cellSize-50;
        this.currentState[a+7][a+7]=2;
        this.currentState[a+8][a+7]=2;
        this.currentState[a+9][a+7]=2;
       this.currentState[a+11][a+7]=2;
        this.currentState[a+7][a+8]=2;
       this.currentState[a+10][a+9]=2;
       this.currentState[a+11][a+9]=2;
        this.currentState[a+8][a+10]=2;
        this.currentState[a+9][a+10]=2;
       this.currentState[a+11][a+10]=2;
        this.currentState[a+7][a+11]=2;
        this.currentState[a+9][a+11]=2;
       this.currentState[a+11][a+11]=2;
       */
        
        
        console.log("INIT DONE");
    }
    this.random = function(min,max){
       return min <= max ? min + Math.round(Math.random() * (max - min)) : null;
    }
    this.randomInit = function(){
        var i, liveCells = (this.h/this.cellSize * this.w/this.cellSize) * 0.16;
        for (i = 0; i < liveCells; i++) {
            var x = this.random(1,(this.w/this.cellSize)-1);
            var xx=this.random(1,(this.h/this.cellSize)-1);
            this.currentState[x][xx]=1;
            this.nextState[x][xx]=1;
        }   
    }
    this.drawCell = function(x,y,state){
        if(state>=1){
            if(this.ageColorEnable){//may reduce performance
                GameMain.panel.fillStyle = this.ageColor(state);
            }
             GameMain.panel.fillRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize );
        }else{
             GameMain.panel.clearRect(x*this.cellSize,y*this.cellSize,this.cellSize,this.cellSize );
        }
    }
}
function updateG(){
    var start = performance.now();
    GameState.calculate();
     var stop_calc = performance.now();
    //GameMain.clear();
     var stop_clear = performance.now();
   GameState.updateGUI();
     var stop_gui = performance.now();
   requestAnimationFrame(updateG);
     var stop =  performance.now();
    if(GameState.showBenchmark){
         $("#fps").html(
        gen+" "+alive+"<br>"+" App FPS:"+(1/((stop-start)/1000)).toFixed(2)+ " | Time[ms]:"+(stop-start).toFixed(2)+"<br> Visual FPS:"+(1/((Interval+stop-start)/1000)).toFixed(2)+ " | Time[ms]:"+(Interval+stop-start).toFixed(2)+"<br>-------------------<br>  Calc FPS:"+(1/((stop_calc-start)/1000)).toFixed(2)+" | Time[ms]:"+(stop_calc-start).toFixed(2)+"<br>  Clear FPS:"+(1/((stop_clear-stop_calc)/1000)).toFixed(2)+"<br>  Update GUI FPS:"+(1/((stop_gui-stop_clear)/1000)).toFixed(2));
    }
}
 


