let Observer = require('Observer');
let GameData = require('GameData');
let UIMgr = require('UIMgr');
let GameLocalMsg = require('GameLocalMsg');

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
        // _ballStartPos: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.Start,
            GameLocalMsg.Msg.BallEndPos
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.Start) {
            this._touchFlag = true;
            this._initTouch();
        } else if (msg === GameLocalMsg.Msg.BallEndPos) {
            let pos = data;
            if (this._ballEndFlag === false) {
                this._ballEndFlag = true;
                this._showBall(pos);
            } else {
                this._playBallAct(pos);
            }
        }
    },
    onLoad() {
        this._initMsg();
        this._initView();
        this._initPhysics();

    },

    start() {

    },

    // update (dt) {},
    _loadJson(path, cb) {
        let url = cc.url.raw(path);
        cc.loader.load(url, function (err, results) {
            if (err) {
                console.log('err: ', err);
                return;
            }
            cb(results);
        });
    },

    _showBlocks(data1, data2, parentNode) { //col代表列，row代表行
        let row = data1.length;
        for (let i = 0; i < 11; ++i) {
            let rowArr = data1[row - 11 + i];
            let col = 11;
            for (let j = 0; j < col; ++j) {
                if (data1[row - 11 + i][j] !== 0) {
                    let blockPre = cc.instantiate(this.blockPre);
                    this.blockLayer.addChild(blockPre);
                    let w = parentNode.width;
                    let offset = blockPre.width / 10;
                    blockPre.width = blockPre.height = w / col - offset;
                    let tempWidth = w / col;
                    blockPre.x = (j - Math.floor(col / 2)) * tempWidth;
                    blockPre.y = -i * tempWidth - tempWidth / 2;
                    blockPre.getComponent('Block').initView(data1[row - 11 + i][j], data2[row - 11 + i][j]);
                }
            }
        }
        //加载预览
        this._showPreview(data1);
    },

    _initView() {
        // this._ballStartPos = this.spBall.node.position;
        let stage = GameData.selectStage;
        let path = 'resources/map/mapdata' + stage + '.json';
        this._loadJson(path, function (results) {
            this._showBlocks(results.type.layer1.data, results.type.layer2.data, this.blockLayer);

        }.bind(this));
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
            // this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            // this._draw(this._touchP);
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
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this._draw(this._touchP);
            this.spBall.node.active = false;
            this.schedule(this._shootBall, 0.1, GameData.ballCount - 1, 0);
        }.bind(this));

        this.ballLayer.on('touchcancel', function (event) {
            this._touchP = this.ballLayer.convertToNodeSpaceAR(event.getLocation());
            this._draw(this._touchP);

        }.bind(this));
    },

    _draw(tarPos) {
        let p0 = this.spBall.node.position;
        let p1 = tarPos;
        this._touchAngle = cc.pToAngle(cc.pNormalize(cc.pSub(p1, p0)));
    },

    _shootBall() {
        let ballPre = cc.instantiate(this.ballPre);
        this.ballLayer.addChild(ballPre);
        ballPre.position = this.spBall.node.position;
        this._applySpeed(ballPre);
    },

    _applySpeed(preNode) {
        let _phyBody = preNode.getComponent(cc.RigidBody);
        let speed = _phyBody.linearVelocity;
        speed.y = GameData.ballSpeed * Math.sin(this._touchAngle);
        speed.x = GameData.ballSpeed * Math.cos(this._touchAngle);
        _phyBody.linearVelocity = speed;
    },

    _showBall(pos) {
        this.spBall.node.active = true;
        this.spBall.node.position = cc.pAdd(pos, cc.p(0, this.spBall.node.height / 2));
    },
    _playBallAct(pos) {
        let tempBall = cc.instantiate(this.spBall.node);
        this.ballLayer.addChild(tempBall);
        tempBall.active = true;
        tempBall.position = cc.pAdd(pos, cc.p(0, this.spBall.node.height / 2));
        let tarPos = this.spBall.node.position;
        let moveAct = cc.moveTo(0.5, tarPos);
        tempBall.runAction(cc.sequence(moveAct, cc.removeSelf()));
    }
});