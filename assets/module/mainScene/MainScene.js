let Observer = require('Observer');
let GameData = require('GameData');
let UIMgr = require('UIMgr');
let GameLocalMsg = require('GameLocalMsg');
// let Util = require('Util');

cc.Class({
    extends: Observer,

    properties: {
        blockPre: {
            displayName: 'blockPre',
            default: null,
            type: cc.Prefab
        },
        blockLayer: {
            displayName: 'blockLayer',
            default: null,
            type: cc.Node
        },
        previewPre: {
            displayName: 'previewPre',
            default: null,
            type: cc.Prefab
        },
        ballLayer: {
            displayName: 'ballLayer',
            default: null,
            type: cc.Node
        },
        spBall: {
            displayName: 'spBall',
            default: null,
            type: cc.Sprite
        },

        _touchFlag: false,
        _touchP: null,
        _touchAngle: null,
        ballPre: {
            displayName: 'ballPre',
            default: null,
            type: cc.Prefab
        },
        _ballEndFlag: false,
        _backBallCount: null,
        lblBallCount: {
            displayName: 'lblBallCount',
            default: null,
            type: cc.Label
        },
        _count: 0, //发射球次数
        _groundY: null,
        _row: null,
        _col: null,
        _totalScore: 0,
        lblTotalScore: {
            displayName: 'lblTotalScore',
            default: null,
            type: cc.Label
        },
        effectLayer: {
            displayName: 'effectLayer',
            default: null,
            type: cc.Node
        },
        effectPre7: {
            displayName: 'effectPre7',
            default: null,
            type: cc.Prefab
        },
        effectPre8: {
            displayName: 'effectPre8',
            default: null,
            type: cc.Prefab
        },
        effectBlockArr: [],
        progressBar: {
            displayName: 'progressBar',
            default: null,
            type: cc.ProgressBar
        },
        spStar0: {
            displayName: 'spStar0',
            default: null,
            type: cc.Sprite
        },
        spStar1: {
            displayName: 'spStar1',
            default: null,
            type: cc.Sprite
        },
        spStar2: {
            displayName: 'spStar2',
            default: null,
            type: cc.Sprite
        },
        _blockNum: null,
        uiNode: {
            displayName: 'uiNode',
            default: null,
            type: cc.Node
        },
        endPre: {
            displayName: 'endPre',
            default: null,
            type: cc.Prefab
        },
        spWarnBg: {
            displayName: 'spWarnBg',
            default: null,
            type: cc.Sprite
        },
        btnBallBack: {
            displayName: 'btnBallBack',
            default: null,
            type: cc.Button
        },
        bottomLayout: {
            displayName: 'bottomLayout',
            default: null,
            type: cc.Node
        },
        _ballEndPos: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.Start,
            GameLocalMsg.Msg.BallEndPos,
            GameLocalMsg.Msg.PlusBall,
            GameLocalMsg.Msg.PlusScore,
            GameLocalMsg.Msg.EffectPos,
            GameLocalMsg.Msg.SpeedUp
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.Start) {
            this._touchFlag = true;
            this._initTouch();
        } else if (msg === GameLocalMsg.Msg.BallEndPos) {
            let pos = data;
            // this._ballEndPos = data;
            if (this._ballEndFlag === false) {
                this._ballEndFlag = true;
                this._ballEndPos = pos;
                this._showBall(pos);
                this._backBallCount++;
                this._checkTouch();
            } else {
                this._playBallAct(pos);
            }
        } else if (msg === GameLocalMsg.Msg.PlusBall) {
            GameData.ballCount += data;
            this._backBallCount += data;
        } else if (msg === GameLocalMsg.Msg.PlusScore) {
            --this._blockNum;
            this._totalScore += data;
            this._refreshTotalScore();
        } else if (msg === GameLocalMsg.Msg.EffectPos) {
            let type = data.type;
            let pos = data.pos;
            let uuid = data.uuid;
            if (this.effectBlockArr.indexOf(uuid) === -1) {
                this.effectBlockArr.push(uuid);
            }
            this._showEffect(type, pos);
        } else if (msg === GameLocalMsg.Msg.SpeedUp) {
            let uuid = data.uuid;
            if (this.effectBlockArr.indexOf(uuid) === -1) {
                this.effectBlockArr.push(uuid);
            }
        }
    },
    onLoad() {
        this._initMsg();
        this._initPhysics();
        this._initView();

        this._initBall();
        this._plus = 0;
    },

    start() {

    },

    _initBall() {
        this._backBallCount = 0;
        this._groundY = -this.ballLayer.height / 2 + this.spBall.node.height / 2;
        this.spBall.node.y = this._groundY;
        this.lblBallCount.string = "X" + GameData.ballCount;
    },

    // update (dt) {},

    _loadData() {
        let data = GameData.stageData;

        this._row = data.type.layer1.data.length;
        this._col = data.type.layer1.data[0].length;
        this._data1 = data.type.layer1.data; //类型布局数据
        this._data2 = data.type.layer2.data; //基数分数布局数据
        this._leftRow = this._row - GameData.defaultCol; //未显示行数
        this._showBlocks(this._data1, this._data2, this.blockLayer);
        this._initAllScore();
    },

    _showBlocks(data1, data2, parentNode) { //col代表列，row代表行
        let row = data1.length;
        for (let i = 0; i < GameData.defaultCol; ++i) {
            let rowArr = data1[row - GameData.defaultCol + i];
            let col = GameData.defaultCol;
            for (let j = 0; j < col; ++j) {
                if (data1[row - GameData.defaultCol + i][j] !== 0) {
                    let blockPre = cc.instantiate(this.blockPre);
                    this.blockLayer.addChild(blockPre);
                    let w = parentNode.width;
                    let offset = blockPre.width / 10;
                    blockPre.width = blockPre.height = w / col - offset;
                    let tempWidth = w / col;
                    blockPre.x = (j - Math.floor(col / 2)) * tempWidth;
                    blockPre.y = -i * tempWidth - tempWidth / 2;
                    blockPre.getComponent('Block').initView(data1[row - GameData.defaultCol + i][j], data2[row - GameData.defaultCol + i][j]);
                }
            }
        }
        //加载预览
        this._showPreview(data1);
    },

    _initView() {
        this._totalScore = 0;
        this._loadData();
        this._refreshTotalScore();
        this._hideWarning();
        this._ballEndPos = null;
        this._showBtnBallBack(false);
    },

    _showPreview(data) {
        UIMgr.createPrefabAddToRunningScene(this.previewPre, function (ui) { //添加预览
            // ui.parent.getComponent('ComUIBg').bgNode.opacity = 0;
            ui.getComponent('Preview').initView(data);
        }.bind(this));
    },

    _initPhysics() {
        this.physicsManager = cc.director.getPhysicsManager();
        this.physicsManager.enabled = true;
        // this.physicsManager.debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        //     cc.PhysicsManager.DrawBits.e_pairBit |
        //     cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        //     cc.PhysicsManager.DrawBits.e_jointBit |
        //     cc.PhysicsManager.DrawBits.e_shapeBit;
    },

    _initTouch() {
        this.ballLayer.on('touchstart', function (event) {
            // this._touchFlag = true;
            if (this._touchFlag === true) {
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this._draw(this._touchP);
            }
        }.bind(this));

        this.ballLayer.on('touchmove', function (event) {
            if (this._touchFlag === true) {
                //将世界坐标转化为本地坐标
                // let touchPoint = this.node.parent.convertToNodeSpace(event.getLocation());
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this._draw(this._touchP);
            }
        }.bind(this));

        this.ballLayer.on('touchend', function (event) {
            if (this._touchFlag === true) {
                this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
                this._draw(this._touchP);
                this.spBall.node.active = false;
                let _tempCount = GameData.ballCount - 1;

                this._count = GameData.ballCount;
                let srcPos = this.spBall.node.position;
                this._ballEndPos = srcPos;
                this._showShadowBall(srcPos);
                this.schedule(this._shootBall.bind(this, srcPos), 0.1, _tempCount, 0);
                this._touchFlag = false;
                this._showBtnBallBack(true);
                if (this.spWarnBg.node.active === false) {
                    return;
                }
                this._hideWarning();

            }
        }.bind(this));

        this.ballLayer.on('touchcancel', function (event) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this._draw(this._touchP);

        }.bind(this));
    },

    _showShadowBall(pos) {
        this._shadowBall = cc.instantiate(this.spBall.node);
        this.ballLayer.addChild(this._shadowBall);
        this._shadowBall.position = pos;
        this._shadowBall.active = true;
    },

    _hideShadowBall() {
        this._shadowBall.active = false;
    },

    _draw(tarPos) {
        let p0 = this.spBall.node.position;
        let p1 = tarPos;
        this._touchAngle = cc.pToAngle(cc.pNormalize(cc.pSub(p1, p0)));
    },

    _shootBall(srcPos) {
        let ballPre = cc.instantiate(this.ballPre);
        this.ballLayer.addChild(ballPre);

        ballPre.position = srcPos;
        ballPre.getComponent('Ball').applySpeed(this._touchAngle);
        this._count--;
        if (this._count <= 0) {
            this._hideShadowBall();
        }
    },

    _showBall(pos) {
        this.spBall.node.active = true;
        this.spBall.node.x = pos.x;
        this.spBall.node.y = this._groundY;
        this._refreshBallCount(this._backBallCount);
    },
    _playBallAct(pos) {
        let tempBall = cc.instantiate(this.spBall.node);
        this.ballLayer.addChild(tempBall);
        tempBall.active = true;
        tempBall.removeAllChildren();
        tempBall.position = cc.pAdd(pos, cc.p(0, this.spBall.node.height / 2));
        let tarPos = this.spBall.node.position;
        let moveAct = cc.moveTo(0.5, tarPos);
        this._backBallCount++;
        this._refreshBallCount(this._backBallCount);
        tempBall.runAction(cc.sequence(moveAct, cc.removeSelf(), cc.callFunc(this._checkTouch, this)));

        // this._checkTouch();
    },

    _checkTouch() { //所有球回归的节点———每一次发球后的结束判定点
        if (this._backBallCount < GameData.ballCount) {
            return;
        } else {
            this._backBallCount = 0;
            this._touchFlag = true;
            this._ballEndFlag = false;
            this._blockMove();
            GameData.resetMultScore();
            this._cleanEffectBlock();
            this._refreshState();
            this._ballEndPos = null;
            this._showBtnBallBack(false);
        }
    },

    _refreshBallCount(count) {
        this.lblBallCount.string = "X" + count;
    },
    _blockMove() {
        let blockArr = this.blockLayer.children;
        for (const blockNode of blockArr) {
            let h = this.blockLayer.width / GameData.defaultCol;
            let moveAct = cc.moveBy(0.2, cc.p(0, -h));
            blockNode.runAction(moveAct);
        }
        if (this._leftRow > 0) {
            this._leftRow--;
            let tempData1 = this._data1[this._leftRow];
            let tempData2 = this._data2[this._leftRow];

            this._showTempBlocks(tempData1, tempData2, this.blockLayer);
        }
    },
    _showTempBlocks(data1, data2, parentNode) {

        for (let i = 0; i < GameData.defaultCol; ++i) {

            if (data1[i] !== 0) {
                let tempBlockPre = cc.instantiate(this.blockPre);
                parentNode.addChild(tempBlockPre);
                let w = parentNode.width;
                let offset = tempBlockPre.width / 10;
                tempBlockPre.width = tempBlockPre.height = w / GameData.defaultCol - offset;
                let tempBlockWidth = w / GameData.defaultCol;
                tempBlockPre.x = (i - Math.floor(GameData.defaultCol / 2)) * tempBlockWidth;
                tempBlockPre.y = -tempBlockWidth / 2;
                tempBlockPre.getComponent('Block').initView(data1[i], data2[i]);
            }
        }

    },

    _refreshTotalScore() {

        this.lblTotalScore.string = this._totalScore;
        this.progressBar.progress = this._totalScore / this._allScore;
        this._refreshStar(this.progressBar.progress);
    },
    _showEffect(type, pos) {
        let effectPre = null;
        effectPre = cc.instantiate(this['effectPre' + type]);
        this.effectLayer.addChild(effectPre);
        if (type === 7) {
            effectPre.y = pos.y;
        } else if (type === 8) {
            effectPre.x = pos.x;
        }
        effectPre.runAction(cc.sequence(cc.blink(0.1, 1), cc.removeSelf()));

    },

    _cleanEffectBlock() {
        if (this.effectBlockArr.length !== 0) {
            for (const item of this.effectBlockArr) {
                this.blockLayer.getChildByUuid(item).destroy();
            }
            this.effectBlockArr = [];
        }
    },

    _initAllScore() {
        let _count = 0;
        this._allScore = 0;
        this.progressBar.progress = 0;
        for (const item of this._data2) {
            for (const item0 of item) {
                if (item0 !== 0) {
                    _count++;
                    this._allScore += _count * 10;
                }
            }
        }
        this._blockNum = _count;
    },

    _refreshStar(progress) {
        if (progress === 0) {
            this.spStar0.node.active = true;
            this._starNum = 1;
        }
        if (progress > 0.7 && progress < 1) {
            this.spStar1.node.active = true;
            this._starNum = 2;
        }
        if (progress >= 1) {
            this.spStar2.node.active = true;
            this._starNum = 3;
        }
    },

    _refreshState() {
        let _count = this.blockLayer.childrenCount;
        let _leftCount = 0;
        let _arr = [1, 2, 3, 4, 5, 6];
        for (let i = 0; i < _count; ++i) {
            let _leftBlock = this.blockLayer.children[i];
            let script = _leftBlock.getComponent('Block');
            let _type = script._type;
            if (_arr.indexOf(_type) !== -1) {
                _leftCount++;
                this._checkWarning(_leftBlock);
            }
        }
        if (_leftCount <= 0) { //TODO 为啥等于0时有问题？
            let data = {
                state: 1, //1通关，0失败
                starNum: this._starNum,
                stage: GameData.selectStage //选择的关卡
            };
            //开启结束状态
            UIMgr.createPrefab(this.endPre, function (root, ui) {
                this.uiNode.addChild(root);
                ui.getComponent('End').initView(data);
            }.bind(this));
        }
    },

    _checkWarning(block) {

        let h = this.blockLayer.width / GameData.defaultCol;
        // let y = block.y - h * 0.5;
        let side = this.blockLayer.height;
        // let side1 = side - h;
        // let side2 = side - 2 * h;

        let num = Math.floor(side / h);

        let curNum = Math.floor(Math.abs(block.y) / h);
        console.log('num: ', num);
        console.log('curNUm: ', curNum);
        if (curNum === num - 2) {
            this._showWaring();
            this.spWarnBg.node.runAction(cc.repeatForever(cc.sequence(cc.fadeIn(1), cc.fadeOut(1))));
        } else if (curNum === num - 1) {
            let data = {
                state: 0,
                starNum: this._starNum,
                stage: GameData.selectStage
            };
            //开启结束状态
            UIMgr.createPrefab(this.endPre, function (root, ui) {
                this.uiNode.addChild(root);
                ui.getComponent('End').initView(data);
            }.bind(this));
        }
    },

    _showWaring() {
        this.spWarnBg.node.active = true;
    },
    _hideWarning() {
        this.spWarnBg.node.active = false;
    },
    _showBtnBallBack(flag) {
        this.btnBallBack.node.active = flag;
        this.bottomLayout.active = !flag;
    },

    onBtnClickToBallBack() {
        this.unscheduleAllCallbacks();
        let _tempBallArr = this.ballLayer.children;
        let len = _tempBallArr.length;
        for (let i = 0; i < len; ++i) {
            let _ball = _tempBallArr[i];
            if (_ball.name === 'Ball') {
                _ball.removeComponent(cc.PhysicsCircleCollider);
                _ball.removeComponent(cc.RigidBody);
                _ball.runAction(cc.sequence(cc.moveTo(0.5, this._ballEndPos), cc.removeSelf()));
            }
        }
        this._hideShadowBall();
        this.spBall.node.active = true;
        this.spBall.node.position = cc.p(this._ballEndPos.x, this._groundY);
        this._refreshBallCount(GameData.ballCount);
        this._backBallCount = 0;
        this._touchFlag = true;
        this._ballEndFlag = false;
        this._blockMove();
        GameData.resetMultScore();
        this._cleanEffectBlock();
        this._refreshState();
        this._ballEndPos = null;
        this._showBtnBallBack(false);
    }
});