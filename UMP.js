function gameUMP(container)
{
    this.container = container;
    this.tiles = new Array(72);
    this.posOfPop = 67;
    this.isOver = false;
    this.n = 30;
    this.isLight = 1;
    this.isFlame = 1;
    this.version1 = 1.82;
}

gameUMP.prototype = {
    //初始化
    init: function(){
        this.isOver = false;
        this.n = 30;
        for(var i = 0, len = this.tiles.length; i < len; i++){
            var tile = this.newTile(0);
            tile.setAttribute('index', i);
            this.container.appendChild(tile);
            this.tiles[i] = tile;
        }
        this.initLines(3);
        this.randomTile();
    },
    initLines: function(line){
        for(var i = 0, len = line * 8; i < len; i++){
            var rand = Math.random();
            var thisPop = 32;
            if(rand < 0.35){
                thisPop = 2;
            }
            if(rand < 0.55 && rand > 0.35){
                thisPop = 4;
            }
            if(rand > 0.55 && rand < 0.70){
                thisPop = 8;
            }
            if(rand > 0.70 && rand < 0.85){
                thisPop = 16;
            }
            this.setTileVal(this.tiles[i], thisPop);

        }
    },
    newTile: function(val){
        var tile = document.createElement('div');
        this.setTileVal(tile, val)
        return tile;
    },
    setTileVal: function(tile, val){
        tile.className = 'tile tile' + val;
        tile.setAttribute('val', val);
        tile.innerHTML = val > 0 ? val : '';
    },
    //产生随机的新数块
    randomTile: function(){
        var newPop = this.tiles[67];
        var rand = Math.random();
        var newNum = 666;
        this.isLight = 1;
        this.isFlame = 0;
        if(rand < 0.80){
            newNum = 2;
            this.isLight = 0;
            this.isFlame = 0;
        }
        if(rand > 0.80 && rand < 0.97){
            newNum = 4;
            this.isLight = 0;
            this.isFlame = 0;
        }
        if(rand > 0.97 && rand < 0.985){
            newNum = 777;
            this.isLight = 0;
            this.isFlame = 1;
        }
        this.setTileVal(newPop, newNum);
        this.posOfPop = 67;
    },
    bomb:function(thisPos){
        var pos = thisPos;
        var upPos = pos - 8;
        var lfPos = pos - 1;
        var rtPos = pos + 1;
        var dnPos = pos + 8;
        var all = this.tiles;
        if((upPos > 0 || upPos == 0) && all[upPos].getAttribute('val') == all[pos].getAttribute('val')){
            this.merge(all[upPos], all[pos]);
            this.bomb(upPos);
        }else if(Math.floor(lfPos/8) == Math.floor(pos/8) 
            && all[lfPos].getAttribute('val') == all[pos].getAttribute('val')){
            this.merge(all[lfPos], all[pos]);
            this.bomb(lfPos);
        }else if(Math.floor(rtPos/8) == Math.floor(pos/8) 
            && all[rtPos].getAttribute('val') == all[pos].getAttribute('val')){
            this.merge(all[rtPos], all[pos]);
            this.bomb(rtPos);
        }else if(dnPos < 64 && all[dnPos].getAttribute('val') == all[pos].getAttribute('val')){
            this.merge(all[dnPos], all[pos]);
            this.bomb(dnPos);
        }
    },
    correct:function(){
        for(var i = 8; i < 63; i++){
            var cur = this.tiles[i];
            var curNum = cur.getAttribute('val');
            if(curNum != 0){
                var up = this.checkUp(i);
                if(up != i){
                    var upOne = this.tiles[up];
                    this.setTileVal(upOne, curNum);
                    this.setTileVal(cur, 0);  
                }             
            }
        }
    },
    checkUp:function(cur){
        var thisOne = this.tiles[cur];
        if(cur - 8 >0 || cur - 8 == 0){
            var theUp = this.tiles[cur - 8];
            var theUpNum = theUp.getAttribute('val');
            if(theUpNum != 0){
                return cur;
            } 
            if(theUpNum == 0){
                return this.checkUp(cur - 8);
            }
        } else {
            return cur;
        }
    },

    magicLight:function(pos){
        if(pos > 0 || pos == 0){
            this.setTileVal(this.tiles[pos],0);
            this.magicLight(pos - 8);
        }
    },

    sleep:function(s){
        var now = new Date(); 
        var exitTime = now.getTime() + s; 
        while (true) { 
            now = new Date(); 
            if (now.getTime() > exitTime) 
                return; 
        }
    },

    magicFire:function(pos){
        var posL = pos - 1;
        var posR = pos + 1;
        var posU = pos - 8;
        var posD = pos + 8;
        var posLU = pos - 9;
        var posRU = pos - 7;
        var posLD = pos + 7;
        var posRD = pos + 9;
        if(pos == 0){
            this.setTileVal(this.tiles[posR], 0);
            this.setTileVal(this.tiles[posD], 0);
            this.setTileVal(this.tiles[posRD], 0);
        }else if(pos > 0 && pos % 8 == 0 && pos < 56){
            this.setTileVal(this.tiles[posU],0);
            this.setTileVal(this.tiles[posRU],0);
            this.setTileVal(this.tiles[posR], 0);
            this.setTileVal(this.tiles[posD], 0);
            this.setTileVal(this.tiles[posRD], 0);
        }else if(pos == 56){
            this.setTileVal(this.tiles[posU],0);
            this.setTileVal(this.tiles[posRU],0);
            this.setTileVal(this.tiles[posR], 0);
        }else if(pos == 7){
            this.setTileVal(this.tiles[posL], 0);
            this.setTileVal(this.tiles[posD], 0);
            this.setTileVal(this.tiles[posLD], 0);
        }else if(pos > 7 && pos % 8 == 7 && pos < 63){
            this.setTileVal(this.tiles[posU],0);
            this.setTileVal(this.tiles[posLU],0);
            this.setTileVal(this.tiles[posL], 0);
            this.setTileVal(this.tiles[posD], 0);
            this.setTileVal(this.tiles[posLD], 0);
        }else if(pos == 63){
            this.setTileVal(this.tiles[posU],0);
            this.setTileVal(this.tiles[posLU],0);
            this.setTileVal(this.tiles[posL], 0);
        }else if(pos > 0 && pos < 7){
            this.setTileVal(this.tiles[posR],0);
            this.setTileVal(this.tiles[posL],0);
            this.setTileVal(this.tiles[posLD], 0);
            this.setTileVal(this.tiles[posRD], 0);
            this.setTileVal(this.tiles[posD], 0);
        }else if(pos > 56 && pos < 63){
            this.setTileVal(this.tiles[posR],0);
            this.setTileVal(this.tiles[posL],0);
            this.setTileVal(this.tiles[posLU], 0);
            this.setTileVal(this.tiles[posRU], 0);
            this.setTileVal(this.tiles[posU], 0);
        }else {
            this.setTileVal(this.tiles[posU],0);
            this.setTileVal(this.tiles[posLU],0);
            this.setTileVal(this.tiles[posL], 0);
            this.setTileVal(this.tiles[posD], 0);
            this.setTileVal(this.tiles[posLD], 0);
            this.setTileVal(this.tiles[posR], 0);
            this.setTileVal(this.tiles[posRD], 0);
            this.setTileVal(this.tiles[posRU], 0);
        }
        this.setTileVal(this.tiles[pos], 0);

    },
    move:function(direction){
        var j;
        switch(direction){
            case ' ':
                this.n = this.n - 1;
                for(var i = 8; i > 0; i--){
                    var pos = this.posOfPop;
                    var upPop = this.tiles[pos - 8];
                    var upVal = upPop.getAttribute('val');
                    if(upVal == 0){
                        var cur = this.tiles[pos];
                        var curNum = cur.getAttribute('val');
                        this.setTileVal(this.tiles[pos - 8], curNum);
                        this.setTileVal(this.tiles[pos], 0);
                        this.posOfPop = this.posOfPop - 8;
                    }
                }

                if(this.n == 0){
                    this.n = 30;
                    for(var i = 63; i >= 0; i--){
                        var cur = this.tiles[i].getAttribute('val');
                        this.setTileVal(this.tiles[i + 8], cur);
                        if(cur != 0 && i + 8 > 63){
                            this.isOver = true;
                        }
                    }
                    this.initLines(1);
                }
                
                if(this.isLight == 1){
                    this.magicLight(this.posOfPop);
                    this.isLight = 0;
                    this.randomTile();
                    break;
                }

                if(this.isFlame == 1){
                    this.magicFire(this.posOfPop);
                    this.isFlame = 0;
                    this.correct();
                    this.randomTile();
                    break;
                }
                this.bomb(this.posOfPop);
                //Add new lines when shot more than 30 times

                this.correct();
                //Popo bomb  
                if(pos > 63){
                    this.isOver = true;
                }

                /*var pos = this.posOfPop;
                var upPos = pos - 8;
                var lfPos = pos - 1;
                var rtPos = pos + 1;
                var all = this.tiles;
                if(upPos > 0 && all[upPos].getAttribute('val') == all[pos].getAttribute('val')){
                    this.merge(all[upPos], all[pos]);
                }else if(Math.floor(lfPos/8) === Math.floor(pos/8) 
                    && all[lfPos].getAttribute('val') === all[pos].getAttribute('val')){
                    this.merge(all[lfPos], all[pos]);
                }else if(Math.floor(rtPos/8) === Math.floor(pos/8) 
                    && all[rtPos].getAttribute('val') === all[pos].getAttribute('val')){
                    this.merge(all[rtPos], all[pos]);
                }*/
                this.randomTile();
                break;
            /*case 'S':
                for(var i = 55; i >= 0; i--){
                    j = i;
                    while(j <= 55){
                        this.merge(this.tiles[j + 8], this.tiles[j]);
                        j += 8;
                    }
                }
                break;*/
            case 'Q':
                if(this.posOfPop > 64){
                    var pos = this.posOfPop;
                    var cur = this.tiles[pos];
                    var curNum = cur.getAttribute('val');
                    this.setTileVal(this.tiles[pos - 1], curNum);
                    this.setTileVal(this.tiles[pos], 0);
                    this.posOfPop = this.posOfPop - 1;               
                }
                break;
            case 'W':
                if(this.posOfPop < 71){
                    var pos = this.posOfPop;
                    var cur = this.tiles[pos];
                    var curNum = cur.getAttribute('val');
                    this.setTileVal(this.tiles[pos + 1], curNum);
                    this.setTileVal(this.tiles[pos], 0);
                    this.posOfPop = this.posOfPop + 1;               
                }
                break;
        }
        
    },
    merge: function(prevTile, currTile){
        var prevVal = prevTile.getAttribute('val');
        var currVal = currTile.getAttribute('val');
        if(currVal != 0){
            if(prevVal == 0){
                this.setTileVal(prevTile, currVal);
                this.setTileVal(currTile, 0);
            }
            else if(prevVal == currVal){
                this.setTileVal(prevTile, prevVal * 2);
                this.setTileVal(currTile, 0);
            }
        }
    },
    equal: function(tile1, tile2){
        return tile1.getAttribute('val') == tile2.getAttribute('val');
    },
    max: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 2048){
                return true;
            }
        }
    },
    over: function(){
        if(this.isOver){
            return true;
        }
        for(var i = 0, len = this.tiles.length - 8; i < len; i++){
            if(this.tiles[i].getAttribute('val') == 0){
                return false;
            }
            if(i % 8 != 7){
                if(this.equal(this.tiles[i], this.tiles[i + 1])){
                    return false;
                }
            }
            if(i < 56){
                if(this.equal(this.tiles[i], this.tiles[i + 8])){
                    return false;
                }
            }
        }
        return true;
    },
    clean: function(){
        for(var i = 0, len = this.tiles.length; i < len; i++){
            this.container.removeChild(this.tiles[i]);
        }
        this.isOver = false;
        this.tiles = new Array(72);
        this.n = 0;
    }
}
 
var game, startBtn;
 
window.onload = function(){
    var container = document.getElementById('divUMP');
    game = game || new gameUMP(container);
    startBtn3 = document.getElementById('version');
    startBtn3.style.color = "red";
    startBtn3.style.fontWeight = "bold";
    startBtn3.style.background = "#61e676";
    startBtn3.innerHTML = "Version: " + game.version1 + " " + game.n + " times left for a new line"; 
    startBtn = document.getElementById('UMode');
    startBtn2 = document.getElementById('intro');
    startBtn.onclick = function(){
        this.style.display = 'none';
        startBtn2.style.display = 'none';
        startBtn3.style.background = "#ede789";
        game.init();
    }
    left = document.getElementById('Left');
    right = document.getElementById('Right');
    shoot = document.getElementById('Shoot');
    left.onclick = function(){
        keychar = 'Q';
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn2.style.display = 'block';
            startBtn3.style.background = "#61e676";
            //startBtn.innerHTML = 'You lose! Tap to restart!';
            return;
        }
        game.move(keychar);
        startBtn3.innerHTML = "Version: " + game.version1 + " " + game.n + " times left for a new line";
    }
    right.onclick = function(){
        keychar = 'W';
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn2.style.display = 'block';
            startBtn3.style.background = "#61e676";
            //startBtn.innerHTML = 'You lose! Tap to restart!';
            return;
        }
        game.move(keychar);
        startBtn3.innerHTML = "Version: " + game.version1 + " " + game.n + " times left for a new line";
    }
    shoot.onclick = function(){
        keychar = ' ';
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn2.style.display = 'block';
            startBtn3.style.background = "#61e676";
            //startBtn.innerHTML = 'You lose! Tap to restart!';
            return;
        }
        game.move(keychar);
        startBtn3.innerHTML = "Version: " + game.version1 + " " + game.n + " times left for a new line";
    }
}
 
window.onkeydown = function(e){
    var keynum, keychar;
    if(window.event){       // IE
        keynum = e.keyCode;
    }
    else if(e.which){       // Netscape/Firefox/Opera
        keynum = e.which;
    }
    keychar = String.fromCharCode(keynum);
    if([' ', 'Q', 'W'].indexOf(keychar) > -1){ 
        if(game.over()){
            game.clean();
            startBtn.style.display = 'block';
            startBtn2.style.display = 'block';
            startBtn3.style.background = "#61e676";
            //startBtn.innerHTML = 'You lose! Tap to restart!';
            return;
        }
        game.move(keychar);
        startBtn3.innerHTML = "Version: " + game.version1 + " " + game.n + " times left for a new line";
    }
}
