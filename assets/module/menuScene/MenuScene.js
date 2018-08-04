let Observer = require('Observer');
let GameData = require('GameData');

cc.Class({
    extends: Observer,

    properties: {
        stageCardPre: {
            displayName: 'stageCardPre',
            default: null,
            type: cc.Prefab
        },
        scrollView: {
            displayName: 'scrollView',
            default: null,
            type: cc.ScrollView
        },
        _stageCardPool: null,
        lblBallTime: {
            displayName: 'lblBallTime',
            default: null,
            type: cc.Label
        },
        lblRuby: {
            displayName: 'lblRuby',
            default: null,
            type: cc.Label
        },
        lblStar: {
            displayName: 'lblStar',
            default: null,
            type: cc.Label
        },
    },
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._initMsg();
        GameData.init();
        this._initStageCardPool();
        this._initStageCard();
        this._initProperty();
    },

    start() {

    },

    // update (dt) {},
    _initStageCardPool() {
        this._stageCardPool = new cc.NodePool('StageCard');
        let len = 50;
        for (let i = 0; i < len; ++i) {
            let tempNode = cc.instantiate(this.stageCardPre);
            this._stageCardPool.put(tempNode);
        }
    },
    _initStageCard() {
        let _totalStage = Object.keys(GameData.gamedata_savelv).length;
        let col = 5;
        let row = Math.floor(_totalStage / col);
        let index = 0;
        this.scrollView.content.destroyAllChildren();
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                let stageCardPre = this._stageCardPool.get();
                if (!stageCardPre) {
                    stageCardPre = cc.instantiate(this.stageCardPre);
                }
                this.scrollView.content.addChild(stageCardPre);
                index++;
                let temp = null;
                if (i % 2 === 0) {
                    temp = index;
                } else { //对应是一维数组时 重要公式:index-2*(index%5-1)+4;
                    temp = index + 5 - (j * 2 + 1);
                }
                stageCardPre.getComponent('StageCard').initView(temp);
            }
        }
    },

    _initProperty() {
        this._refreshRuby();
        this._refreshBallTime();
        this._refreshStar();
    },

    _refreshRuby() {
        this.lblRuby.string = GameData.player.ruby;
    },

    _refreshStar() {
        this.lblStar.string = GameData.player.star + 'h';
    },
    _refreshBallTime() {
        this.lblBallTime.string = GameData.player.ballTime;
    }
});