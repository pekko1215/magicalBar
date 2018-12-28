controlRerquest("data/control.smr", main)

function main() {
    window.scrollTo(0, 0);
    bonusdata = {
        bonusget: 301,
        geted: 0,
        jacgamecount:1,
        jacgetcount:1,
        by:'short'
    }
    var notplaypaysound = false;

    slotmodule.on("allreelstop", function(e) {
        if (e.hits != 0) {
            if (e.hityaku.length == 0)
                return
            var matrix = e.hityaku[0].show || e.hityaku[0].matrix ;
            var count = 0;
            slotmodule.once("bet", function() {
                slotmodule.clearFlashReservation()
            })
            if (e.hityaku[0].noflash){
                notplaypaysound = true;
            } else {
                notplaypaysound = false;
                slotmodule.setFlash(null, 0, function(e) {
                    slotmodule.setFlash(flashdata.default, 20)
                    slotmodule.setFlash(replaceMatrix(flashdata.default, matrix, colordata.LINE_F, null), 20, arguments.callee)
                })
            }
        }
        if (e.hits == 0 && jacflag && gamemode == "big") {
            slotmodule.setFlash(flashdata.syoto)
            slotmodule.once('bet', function() {
                slotmodule.clearFlashReservation()
            })
        }
        if (gamemode == "big") {
            bonusdata.bonusgame--;
            changeBonusSeg()
        }

        if (/jac/.test(gamemode)) {
            bonusdata.jacgamecount--;
            changeBonusSeg()
        }

        replayflag = false;
        var nexter = true;

        e.hityaku.forEach(function(d) {
            var matrix = d.matrix;
            switch (gamemode) {
                case 'normal':
                    switch (d.name) {
                        case "右下がりBIG1":
                        case "中段BIG1":
                            // sounder.stopSound("bgm");
                            setGamemode('jac1');
                            sounder.playSound('BIGSTART')
                            bonusdata = {
                                bonusget: 301,
                                geted: 0,
                                jacgamecount:5,
                                jacgetcount:5,
                                by:'long'
                            }
                            bonusflag = "none";
                            changeBonusSeg()
                            clearLamp()
                            break;
                        case "下段BIG2":
                            setGamemode('jac1');
                            sounder.stopSound("bgm");
                            sounder.playSound("BIGSTART");
                            setTimeout(()=>{
                                sounder.playSound("BIG2",true);
                            },1000)
                            bonusdata = {
                                bonusget: 301,
                                geted: 0,
                                jacgamecount:1,
                                jacgetcount:1,
                                by:'short'
                            }
                            changeBonusSeg();
                            bonusflag = "none";
                            clearLamp()
                            break;
                        case "リプレイ":
                            replayflag = true;
                            break;
                    }
                    break;
                case 'big':
                    switch (d.name) {
                        case "鏡JACIN":
                            bonusdata.jacgetcount = 8;
                            bonusdata.jacgamecount = 12;

                            sounder.playSound('BELL2');
                            setGamemode('jac2');
                            bonusflag = "none";
                            changeBonusSeg()
                            clearLamp()
                            break;
                        case "上段JACIN":
                        case "右上がりJACIN":
                            setGamemode('jac1');
                            sounder.playSound("BIGSTART");
                            bonusdata.jacgamecount = 5;
                            bonusdata.jacgetcount = 5;
                            changeBonusSeg();
                            bonusflag = "none";
                            clearLamp()
                            break;
                        case 'JACIN2':
                                bonusdata.jacgamecount = 1;
                                bonusdata.jacgetcount = 1;
                                setGamemode('jac3')
                                bonusflag = "none";
                            break
                        case "リプレイ":
                            replayflag = true;
                            break;
                        case '鏡15枚':
                            sounder.playSound('BELL1');
                    }
                    break;
                case 'jac1':
                    bonusdata.jacgetcount--;
                    if(d.name == 'JACIN1'){
                        bonusdata.jacgamecount = 5;
                        bonusdata.jacgetcount = 5;
                        bonusflag = "none";
                    }
                    break
                case 'jac2':
                    bonusdata.jacgetcount--;
                    if(d.name == 'JACIN2'){
                        bonusdata.jacgamecount = 1;
                        bonusdata.jacgetcount = 1;
                        setGamemode('jac3')
                        bonusflag = "none";
                    }
                    break;
                case 'jac3':
                    bonusdata.jacgetcount--;
            }
        })

        if (nexter) {
            e.stopend()
        }
    })

    slotmodule.on("payend", function() {
        if (gamemode != "normal") {
            if (bonusdata.geted >= bonusdata.bonusget) {
                slotmodule.emit("bonusend");
                if(gamemode == 'jac1'){
                    sounder.stopSound('bgm')
                    sounder.playSound('BIGEND1');
                }
                bonusflag = 'none'
                setGamemode("normal")
                sounder.stopSound('bgm')
            }
            if (/jac/.test(gamemode)) {
                if (bonusdata.jacgamecount == 0 || bonusflag.jacgetcount == 0) {
                    if(gamemode == 'jac1' && bonusflag == 'none'){
                        sounder.stopSound('bgm')
                    }
                    setGamemode('big');
                }
            }
        }
    })
    slotmodule.on("leveron", function() {
    })

    slotmodule.on("bet", function(e) {
        sounder.playSound("3bet")
        if ("coin" in e) {
            (function(e) {
                var thisf = arguments.callee;
                if (e.coin > 0) {
                    coin--;
                    e.coin--;
                    incoin++;
                    changeCredit(-1);
                    setTimeout(function() {
                        thisf(e)
                    }, 100)
                } else {
                    e.betend();
                }
            })(e)
        }
        if (gamemode == "jac") {
            segments.payseg.setSegments(bonusdata.jacgamecount)
        } else {
            segments.payseg.reset();
        }
    })

    slotmodule.on("pay", function(e) {
        var pays = e.hityaku.pay;
        var arg = arguments;
        if (gamemode != "normal") {
            changeBonusSeg();
        }
        if (!("paycount" in e)) {
            e.paycount = 0
            e.se = slotmodule.playControlData.lotmode == 0 ? "pay" : "pay"
            replayflag || notplaypaysound || pays==0 ||sounder.playSound(e.se,true,()=>{},0,0.1);
        }
        if (pays == 0) {
            if (replayflag ) {
                sounder.playSound("replay", false, function() {
                    e.replay();
                    slotmodule.emit("bet", e.playingStatus);
                });
            } else {
                if (replayflag) {
                    e.replay();
                    slotmodule.clearFlashReservation()
                } else {
                    e.payend()
                }
            }
        } else {
            e.hityaku.pay--;
            coin++;
            e.paycount++;
            outcoin++;
            if (gamemode != "normal") {
                bonusdata.geted++;
            }
            changeCredit(1);
            segments.payseg.setSegments(e.paycount)
            if(e.hityaku.pay == 1 && !notplaypaysound){
                sounder.stopSound('pay');
                sounder.playSound('pay')
            }
            setTimeout(function() {
                arg.callee(e)
            }, 75)
        }
    })

    var jacflag = false;

    slotmodule.on("lot", function(e) {
        var ret = -1;
        switch (gamemode) {
            case "normal":
                var lot = normalLotter.lot().name
                lot = window.power || lot;
                window.power = undefined
                if(bonusflag == 'none'){
                    bonusflag = 'BIG'+(rand(3)<2?2:1);
                    if(bonusflag == 'BIG1'){
                        lot = '鏡'
                    }
                }
                switch (lot) {
                    case "リプレイ":
                        ret = lot
                        break;
                    case "鏡":
                        ret = '通常鏡'
                        break
                    default:
                        ret = bonusflag;
                }
                break;
            case "big":
                var lot = normalLotter.lot().name
                lot = window.power || lot;
                window.power = undefined
                switch (lot) {
                    case "リプレイ":
                    case "ベル":
                    case "チェリー":
                        ret = lot
                        break
                    case "鏡":
                        ret = lot
                        if(bonusflag == 'none'){
                            bonusflag = 'jac3'
                        }
                        break;
                    case '1枚役':
                        ret = lot
                        switch(bonusflag){
                            case 'jac1':
                                ret = 'シフトJAC'
                                break
                            case 'jac2':
                                ret = 'JACIN'
                                break
                            case 'jac3':
                                ret = 'カスJAC'
                        }
                        break
                    case "JACIN":
                        if(bonusflag != 'none'){
                            ret = 'リプレイ'
                            break
                        }
                        bonusflag = 'jac2'
                        switch(rand(8)){
                            case 0:
                                ret = '重複リプレイ'
                                break
                            case 1:
                                ret = '重複ベル'
                                break
                            case 2:
                                ret = 'チェリー'
                                break
                            case 3:
                                ret = 'JACIN'
                            default:
                                ret = '鏡'
                        }
                        break
                    default:
                        ret = 'はずれ'
                        switch(bonusflag){
                            case 'jac1':
                                ret = 'シフトJAC'
                                break
                            case 'jac2':
                                ret = 'JACIN';
                                break
                            case 'jac3':
                                ret = 'カスJAC'
                        }
                }
                break;
            case "jac1":
                ret = 'JAC1'
                if(bonusflag == 'jac1'||rand(100)<45){
                    bonusflag = 'jac1';
                    ret = 'JAC2'
                }
                break
            case "jac2":
                ret = 'JACベル'
                if(!rand(4)){
                    ret = 'カスJAC'
                }
                break
            case "jac3":
                ret = ['1枚役','はずれ'][rand(2)]
                break;
        }
        effect(ret);
        return ret;
    })

    slotmodule.on("reelstop", function() {
        sounder.playSound("stop")
    })

    $("#saveimg").click(function() {
        SaveDataToImage();
    })

    $("#cleardata").click(function() {
        if (confirm("データをリセットします。よろしいですか？")) {
            ClearData();
        }
    })

    $("#loadimg").click(function() {
        $("#dummyfiler").click();
    })

    $("#dummyfiler").change(function(e) {

        var file = this.files[0];

        var image = new Image();
        var reader = new FileReader();
        reader.onload = function(evt) {
            image.onload = function() {
                var canvas = $("<canvas></canvas>")
                canvas[0].width = image.width;
                canvas[0].height = image.height;
                var ctx = canvas[0].getContext('2d');
                ctx.drawImage(image, 0, 0)
                var imageData = ctx.getImageData(0, 0, canvas[0].width, canvas[0].height)
                var loadeddata = SlotCodeOutputer.load(imageData.data);
                if (loadeddata) {
                    parseSaveData(loadeddata)
                    alert("読み込みに成功しました")
                } else {
                    alert("データファイルの読み取りに失敗しました")
                }
            }
            image.src = evt.target.result;
        }
        reader.onerror = function(e) {
            alert("error " + e.target.error.code + " \n\niPhone iOS8 Permissions Error.");
        }
        reader.readAsDataURL(file)
    })

    slotmodule.on("reelstart", function() {
        if (okure) {
            setTimeout(function() {
                sounder.playSound("start")
            }, 100)
        } else {
            sounder.playSound("start")
        }
        okure = false;
    })
    var okure = false;
    var sounder = new Sounder();

    sounder.addFile("sound/stop.wav", "stop").addTag("se");
    sounder.addFile("sound/start.wav", "start").addTag("se");
    sounder.addFile("sound/bet.wav", "3bet").addTag("se");
    sounder.addFile("sound/pay.mp3", "pay").addTag("se");
    sounder.addFile("sound/replay.wav", "replay").addTag("se");
    sounder.addFile("sound/big1.mp3", "BIG1").addTag("bgm")
    sounder.addFile("sound/big2.mp3", "BIG2").addTag("bgm")
    sounder.addFile("sound/big3.mp3", "BIG3").addTag("bgm")
    sounder.addFile("sound/big4.mp3", "BIG4").addTag("bgm")
    sounder.addFile("sound/bigend.mp3", "bigend").addTag("se")
    sounder.addFile("sound/handtohand.mp3", "hand").addTag("voice").addTag("se");
    sounder.addFile("sound/wolf.mp3", "WOLF").addTag("se");
    sounder.addFile("sound/big1hit.wav", "big1hit").addTag("se");
    sounder.addFile("sound/keizoku.mp3", "keizoku").addTag("se");
    sounder.addFile("sound/BELL1.mp3", "BELL1").addTag("se");
    sounder.addFile("sound/BELL2.mp3", "BELL2").addTag("se");
    sounder.addFile("sound/reglot.mp3", "reglot").addTag("se");
    sounder.addFile("sound/bigend1.mp3", "BIGEND1").addTag("se")
    sounder.addFile("sound/bigend2.mp3", "BIGEND2").addTag("se");
    sounder.addFile("sound/seg1.mp3", "seg1").addTag("se")
    sounder.addFile("sound/seg2.mp3", "seg2").addTag("se")
    sounder.addFile("sound/seg3.mp3", "seg3").addTag("se")
    sounder.addFile("sound/pakan.mp3", "PAKAN").addTag("se")
    sounder.addFile("sound/spstop.wav", "spstop").addTag("se");
    sounder.addFile("sound/bigstart.mp3", "BIGSTART").addTag("se");

    sounder.addFile("sound/bpay.wav", "bpay").addTag("se").setVolume(0.5);
    sounder.setVolume("se", 0.2)
    sounder.setVolume("bgm", 0.7)
    sounder.loadFile(function() {
        window.sounder = sounder
        console.log(sounder)
    })

    var normalLotter = new Lotter(lotdata.normal);
    var bigLotter = new Lotter(lotdata.big);
    var jacLotter = new Lotter(lotdata.jac);

    var gamemode = "normal";
    var bonusflag = "none"
    var coin = 0;

    window.bonusdata = null;
    var replayflag;

    var isCT = false;
    var CTBIG = false;
    var isSBIG;
    var ctdata = {};
    var regstart;

    var afterNotice;
    var bonusSelectIndex;
    var ctNoticed;

    var playcount = 0;
    var allplaycount = 0;

    var incoin = 0;
    var outcoin = 0;

    var bonuscounter = {
        count: {},
        history: []
    };

    slotmodule.on("leveron", function() {

        if (gamemode != "jac1") {
            playcount++;
            allplaycount++;
        } else {
            if (playcount != 0) {
                bonuscounter.history.push({
                    bonus: gamemode,
                    game: playcount
                })
                playcount = 0;
            }
        }
        changeCredit(0)
    })

    function stringifySaveData() {
        return {
            coin: coin,
            playcontroldata: slotmodule.getPlayControlData(),
            bonuscounter: bonuscounter,
            incoin: incoin,
            outcoin: outcoin,
            playcount: playcount,
            allplaycount: allplaycount,
            name: "ゲッター7",
            id: "getter7"
        }
    }

    function parseSaveData(data) {
        coin = data.coin;
        // slotmodule.setPlayControlData(data.playcontroldata)
        bonuscounter = data.bonuscounter
        incoin = data.incoin;
        outcoin = data.outcoin;
        playcount = data.playcount;
        allplaycount = data.allplaycount
        changeCredit(0)
    }

    window.SaveDataToImage = function() {
        SlotCodeOutputer.save(stringifySaveData())
    }

    window.SaveData = function() {
        var savedata = stringifySaveData()
        localStorage.setItem("savedata", JSON.stringify(savedata))
        return true;
    }

    window.LoadData = function() {
        if (gamemode != "normal" || isCT) {
            return false;
        }
        var savedata = localStorage.getItem("savedata")
        try {
            var data = JSON.parse(savedata)
            parseSaveData(data)
            changeCredit(0)
        } catch (e) {
            return false;
        }
        return true;
    }

    window.ClearData = function() {
        coin = 0;
        bonuscounter = {
            count: {},
            history: []
        };
        incoin = 0;
        outcoin = 0;
        playcount = 0;
        allplaycount = 0;

        SaveData();
        changeCredit(0)
    }


    var setGamemode = function(mode) {
        switch (mode) {
            case 'normal':
                gamemode = 'normal'
                slotmodule.setLotMode(0)
                slotmodule.setMaxbet(3);
                isSBIG = false
                break;
            case 'big':
                gamemode = 'big';
                    slotmodule.setLotMode(1)
                slotmodule.once("payend", function() {
                });
                slotmodule.setMaxbet(3);
                break;
            case 'jac1':
                gamemode = 'jac1';
                    slotmodule.setLotMode(2)
                slotmodule.once("payend", function() {
                });
                slotmodule.setMaxbet(1);
                break;
            case 'jac2':
                gamemode = 'jac2';
                    slotmodule.setLotMode(2)
                slotmodule.once("payend", function() {
                });
                slotmodule.setMaxbet(2);
                break;
            case 'jac3':
                gamemode = 'jac3';
                    slotmodule.setLotMode(2)
                slotmodule.once("payend", function() {
                });
                slotmodule.setMaxbet(3);
                break;
        }
    }

    var segments = {
        creditseg: segInit("#creditSegment", 2),
        payseg: segInit("#paySegment", 2),
        effectseg: segInit("#effectSegment", 4)
    }

    var credit = 50;
    segments.creditseg.setSegments(50);
    segments.creditseg.setOffColor(80, 30, 30);
    segments.payseg.setOffColor(80, 30, 30);
    segments.creditseg.reset();
    segments.payseg.reset();


    var lotgame;

    function changeCredit(delta) {
        credit += delta;
        if (credit < 0) {
            credit = 0;
        }
        if (credit > 50) {
            credit = 50;
        }
        $(".GameData").text("差枚数:" + coin + "枚  ゲーム数:" + playcount + "G  総ゲーム数:" + allplaycount + "G")
        segments.creditseg.setSegments(credit)
    }

    function changeBonusSeg() {
        if(/jac/.test(gamemode)){
            segments.effectseg.setSegments("" + bonusdata.jacgetcount);
        }else{
            segments.effectseg.setSegments("")
        }

    }

    function changeCTGameSeg() {
        segments.effectseg.setOnColor(230, 0, 0);
        segments.effectseg.setSegments(ctdata.ctgame);
    }

    function changeCTCoinSeg() {
        segments.effectseg.setOnColor(50, 100, 50);
        segments.effectseg.setSegments(200 + ctdata.ctstartcoin - coin);
    }

    var LampInterval = {
        right: -1,
        left: -1,
        counter: {
            right: true,
            left: false
        }
    }

    function setLamp(flags, timer) {
        flags.forEach(function(f, i) {
            if (!f) {
                return
            }
            LampInterval[["left", "right"][i]] = setInterval(function() {
                if (LampInterval.counter[["left", "right"][i]]) {
                    $("#" + ["left", "right"][i] + "neko").css({
                        filter: "brightness(200%)"
                    })
                } else {
                    $("#" + ["left", "right"][i] + "neko").css({
                        filter: "brightness(100%)"
                    })
                }
                LampInterval.counter[["left", "right"][i]] = !LampInterval.counter[["left", "right"][i]];
            }, timer)
        })
    }

    function clearLamp() {
        clearInterval(LampInterval.right);
        clearInterval(LampInterval.left);
        ["left", "right"].forEach(function(i) {
            $("#" + i + "neko").css({
                filter: "brightness(100%)"
            })
        })

    }


    function effect(lot) {
        switch(gamemode){
            case 'normal':
                if(lot == 'BIG1')return;
                slotmodule.once('reelstop',function(e){
                    sounder.playSound('BELL1');
                    if(e.count>2){
                        slotmodule.once('reelstop',arguments.callee)
                    }
                    if(e.count == 2 && lot == '通常鏡'){
                        slotmodule.once('reelstop',()=>{
                                slotmodule.freeze()
                                sounder.playSound('BELL1',false,()=>{
                                    sounder.playSound('BELL2',false,()=>{
                                    sounder.playSound('BIG1',true)
                                });
                                setTimeout(()=>slotmodule.resume(),3000)
                            })
                        })
                    }
                })
                break
            case 'jac1':
                slotmodule.zyunjo = [3,2,1]
                switch(bonusdata.by){
                    case 'long':
                        console.log(bonusdata)
                        if(bonusdata.jacgamecount == 1){
                            if(bonusflag == 'jac1'){
                                slotmodule.once('payend',()=>{
                                    if(gamemode!='big'){
                                        sounder.stopSound('bgm');
                                        sounder.playSound('BIGEND1');
                                        return;
                                    }
                                    sounder.stopSound('bgm')
                                    sounder.playSound('keizoku',false,()=>{
                                        sounder.playSound('BIG3',true)
                                    })
                                })
                            }else{
                                slotmodule.once('payend',()=>{
                                    if(gamemode!='jac1'){
                                        sounder.stopSound('bgm');
                                        sounder.playSound('BIGEND1');
                                        return;
                                    }
                                    sounder.playSound('BIGEND1')
                                })
                            }
                        }
                        break
                    case 'short':
                        bonusdata.by = 'long'
                        slotmodule.once('payend',()=>{
                            sounder.stopSound('bgm');
                            sounder.playSound('BIGEND2')
                            if(bonusflag == 'jac1'){
                                slotmodule.once('leveron',()=>{
                                    slotmodule.freeze();
                                    setTimeout(()=>slotmodule.resume(),2000)
                                    sounder.playSound('WOLF',false,()=>{
                                        sounder.playSound('BIG1',true)
                                    })
                                })
                            }
                        })
                }
            break
            case 'big':
            case 'jac2':
                switch(lot){
                    case 'ベル':
                    case 'JACベル':
                    case '重複ベル':
                        if(bonusflag=='jac1')return;
                        slotmodule.once('payend',()=>{
                            slotmodule.freeze();
                            var reachTable = [2,3,5,8,10,12,15,18,20][~~((bonusdata.bonusget - bonusdata.geted)/50)];
                            var isReach = !rand(reachTable);
                            var isLongReach = isReach&&!rand(reachTable);
                            var isReachNum = ~~(bonusdata.bonusget - bonusdata.geted) < 10 && !rand(3)
                            var values = [rand(10)];
                            var p;
                            if(isReach){
                                p = values[0]
                            }else{
                                do{
                                    p = rand(10);
                                }
                                while(values[0]==p);
                            }
                            values.push(p);
                            if(isReach){
                                p = values[0]
                            }else{
                                do{
                                    p = rand(10);
                                }
                                while(values[0]!=p);
                            }
                            var reachNum = ["010","101","232","323","454","545","676","767","898","989"]
                            while(true){
                                p = rand(10);
                                var sum = values[0]+values[1]+p;
                                var t = ''+values[0]+values[1]+p;
                                var reachFlag = reachNum.find(d=>d==t);
                                if(values[0] == values[1] && values[0] == p) continue;
                                if((sum == 9||sum == 19||sum == 21)&&!isReachNum)continue;
                                if(reachFlag && !isReachNum)continue;
                                break;
                            }
                            values.push(p);
                            if(gamemode == 'normal'){
                                p = rand(10);
                                values[0] = values[1] = values[2] = p;
                            }
                            var reachTime = 100;
                            if(isLongReach){
                                if(!rand(4)&&gamemode == 'normal'){
                                    sounder.playSound('seg3');
                                    reachTime = 5241;
                                }else{
                                    sounder.playSound('seg2');
                                    reachTime = 2113
                                }
                            }else{
                                sounder.playSound('seg1');
                            }
                            var efsegs = segments.effectseg.randomSeg();
                            var stoped = 0;
                            var timer = setInterval(() => {
                                stoped < 1 && efsegs[1].next();
                                stoped < 2 && efsegs[2].next();
                                stoped < 3 && efsegs[3].next();
                            }, 30);
                            setTimeout(function looper(){
                                values.forEach((d,i)=>{
                                    if(i<=stoped){
                                        var seg = segments.effectseg.segments[i+1];
                                        seg.draw(seg.mapping('' + d))
                                    }
                                });
                                if(stoped == 2){
                                    if(gamemode == 'normal'){
                                        sounder.playSound('PAKAN')
                                    }
                                    slotmodule.resume();
                                    clearInterval(timer)
                                }
                                stoped++;
                                if(stoped<2){
                                    setTimeout(looper,200);
                                }
                                if(stoped==2){
                                    setTimeout(looper,reachTime)
                                }
                            },200)
                        })
                    break
                    case '鏡':
                        if(gamemode == 'big'){

                        }else{
                            
                        }
                }
                break
            case 'jac3':
        }
        // if(gamemode!='normal'){return}
        // if(lot == 'REG' || bonusflag != 'none'){lot = 'BIG'}
        // var effect = getEffect[lot]&&getEffect[lot]();
        // if(!effect){return}
        // sounder.playSound('yokoku');
        // var efsegs = segments.effectseg.randomSeg();
        // var timer = setInterval(() => {
        //     efsegs[0].next()
        //     efsegs[1].next()
        //     efsegs[2].next()
        // }, 30);
        // var display = (e)=>{
        //     clearInterval(timer);
        //     segments.effectseg.setSegments(e.r.map(d=>d?'o':'_').join(''))
        // }
        // effect.r = [effect.r[1],effect.r[0],effect.r[2]]
        // if(effect.timing >= 1){
        //     slotmodule.once('reelstop',function(e){
        //         var c = 4 - e.count;
        //         if( effect.timing == c ){
        //             sounder.playSound('spstop');
        //             display(effect)
        //         }else{
        //             slotmodule.once('reelstop',arguments.callee)
        //         }
        //     })
        // }else{
        //     display(effect)
        // }
        // slotmodule.once('bet',()=>{
        //     segments.effectseg.reset();
        // })
    }


    $(window).bind("unload", function() {
        SaveData();
    });

    LoadData();
}

function and() {
    return Array.prototype.slice.call(arguments).every(function(f) {
        return f
    })
}

function or() {
    return Array.prototype.slice.call(arguments).some(function(f) {
        return f
    })
}

function rand(m) {
    return Math.floor(Math.random() * m);
}

function replaceMatrix(base, matrix, front, back) {
    var out = JSON.parse(JSON.stringify(base));
    matrix.forEach(function(m, i) {
        m.forEach(function(g, j) {
            if (g == 1) {
                front && (out.front[i][j] = front);
                back && (out.back[i][j] = back);
            }
        })
    })
    return out
}

function flipMatrix(base) {
    var out = JSON.parse(JSON.stringify(base));
    return out.map(function(m) {
        return m.map(function(p) {
            return 1 - p;
        })
    })
}

function segInit(selector, size) {
    var cangvas = $(selector)[0];
    var sc = new SegmentControler(cangvas, size, 0, -3, 79, 46);
    sc.setOffColor(120, 120, 120)
    sc.setOnColor(230, 0, 0)
    sc.reset();
    return sc;
}