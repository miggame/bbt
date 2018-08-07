let GameData = require('GameData');
cc.Class({
    extends: cc.Component,

    properties: {
        lblLevel: {
            displayName: 'lblLevel',
            default: null,
            type: cc.Label
        },
        spR: {
            displayName: 'spR',
            default: null,
            type: cc.Sprite
        },
        spL: {
            displayName: 'spL',
            default: null,
            type: cc.Sprite
        },
        spU: {
            displayName: 'spU',
            default: null,
            type: cc.Sprite
        },
        spCardBg: {
            displayName: 'spCardBg',
            default: null,
            type: cc.Sprite
        },
        starLayout: {
            displayName: 'starLayout',
            default: null,
            type: cc.Node
        },
        _curStage: null,
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
        _stage: null
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._init();
    },

    start() {

    },

    // update (dt) {},

    _init() {
        this.spU.node.active = false;
        this.spR.node.active = false;
        this.spL.node.active = false;
        this.spCardBg.node.active = false;
        this._curStage = GameData.game.curStage;

    },
    initView(i) {
        this._stage = i;
        this.lblLevel.string = parseInt(i);

        this._refreshArrow(i);
        this._showStarLevel(i);
    },
    _refreshArrow(i) {
        if (i % 5 === 0) {
            this.spU.node.active = true;
            this.spL.node.active = this.spR.node.active = !this.spU.node.active;
        } else {
            if (Math.floor(i / 5) % 2 === 0) {
                this.spR.node.active = true;
                this.spL.node.active = this.spU.node.active = !this.spR.node.active;
            } else {
                this.spL.node.active = true;
                this.spR.node.active = this.spU.node.active = !this.spL.node.active;
            }
        }
        if (i <= this._curStage) {
            this._openStage();
        }
    },

    _openStage() {
        this.spCardBg.node.active = true;
    },

    _showStarLevel(i) {
        let key = 'stage' + i;
        let value = GameData.starLevel[i];

        if (value === null || value === undefined) {
            value = new Object(null);
            value.starNum = 0;
            value.state = 0; //0失败，1通过
            GameData.starLevel[i] = value;
        }
        if (value.starNum === 0) {
            this.spStar0.node.active = false;
            this.spStar1.node.active = false;
            this.spStar2.node.active = false;
        } else if (value.starNum === 1) {
            this.spStar0.node.active = true;
            this.spStar1.node.active = false;
            this.spStar2.node.active = false;
        } else if (value.starNum === 2) {
            this.spStar0.node.active = true;
            this.spStar1.node.active = true;
            this.spStar2.node.active = false;
        } else if (value.starNum === 3) {
            this.spStar0.node.active = true;
            this.spStar1.node.active = true;
            this.spStar2.node.active = true;
        }
    },

    onBtnClickToStage() {
        GameData.selectStage = this._stage;
        GameData.ballCount = GameData.getBallCount();
        GameData.stageData = GameData.getStageData();

        cc.director.preloadScene("MainScene", function (err) {
            if (err) {
                console.log('err: ', err);
                return;
            }

        }.bind(this));
        cc.director.loadScene('MainScene');
    }
});