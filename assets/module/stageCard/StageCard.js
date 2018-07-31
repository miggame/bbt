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
        _curStage: null
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
        this.lblLevel.string = parseInt(i);
        this._refreshArrow(i);
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
    }
});