let Observer = require('Observer');
let UIMgr = require('UIMgr');
let GameData = require('GameData');

cc.Class({
    extends: Observer,

    properties: {
        lblStage: {
            displayName: 'lblStage',
            default: null,
            type: cc.Label
        },
        lblState: {
            displayName: 'lblState',
            default: null,
            type: cc.Label
        },
        lblRuby: {
            displayName: 'lblRuby',
            default: null,
            type: cc.Label
        },
        spStarArr: [cc.Sprite],
        progressBar: {
            displayName: 'progressBar',
            default: null,
            type: cc.ProgressBar
        },
        btnNext: {
            displayName: 'btnNext',
            default: null,
            type: cc.Button
        },
        btnRetry: {
            displayName: 'btnRetry',
            default: null,
            type: cc.Button
        },
        _curStage: null
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        this._initOri();

    },

    start() {

    },
    _initOri() {
        this.progressBar.progress = 0;
        for (const _temp of this.spStarArr) {
            _temp.node.active = false;
        }
        cc.director.preloadScene('MenuScene'); //预加载
    },

    // update (dt) {},
    initView(data) {
        let stage = data.stage;
        let state = data.state;
        let starNum = data.starNum;
        this._curStage = stage;
        this._refresh(stage, state, starNum);

    },

    onBtnClickToHome(e) {
        UIMgr.destroyUI(this);
        cc.director.loadScene('MenuScene');
    },

    onBtnClickToNext(e) {
        GameData.selectStage++;
        GameData.getStageData();
        GameData.getBallCount();
        UIMgr.destroyUI(this);
        cc.director.loadScene('MainScene');
    },

    onBtnClickToRetry(e) {
        GameData.getStageData();
        GameData.getBallCount();
        UIMgr.destroyUI(this);
        cc.director.loadScene('MainScene');
    },

    _refresh(stage, state, starNum) {
        this._refreshStage(stage);
        this._refreshState(state);
        this._refreshStar(starNum, state);
        this._refreshRuby();
        this._openNewStage(state, stage);
    },
    _refreshStage(stage) {
        this.lblStage.string = '关卡 ' + stage;
    },
    _refreshState(state) {
        this.lblState.string = state === 1 ? "通关" : "失败";
        this.btnNext.node.active = state === 1 ? true : false;
        this.btnRetry.node.active = !this.btnNext.node.active;
    },
    _refreshStar(num, state) {
        if (num > 3) {
            console.log('星星出错: ', 星星出错);
            return;
        }
        for (let i = 0; i < num; ++i) {
            this.spStarArr[i].node.active = true;
        }

        // let value = GameData.starLevel.get('stage' + this._curStage);
        let value = GameData.starLevel[this._curStage];
        if (num > value.starNum) {
            value.starNum = num;
        }

        if (value.state === 0) {
            value.state = state;
        }
        // GameData.starLevel.set('stage' + this._curStage, value);
        GameData.starLevel[this._curStage] = value;
    },
    _refreshRuby() {
        this.lblRuby.string = GameData.player.ruby;
    },

    _openNewStage(state, stage) {
        if (state === 1) {
            GameData.game.curStage = stage + 1;
            GameData.saveCurStage(GameData.game.curStage);
            GameData.saveStarLevel(GameData.starLevel);
        }
    }
});