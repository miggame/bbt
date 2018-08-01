let Observer = require('Observer');
let GameData = require('GameData');
let UIMgr = require('UIMgr');

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
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [];
    },
    _onMsg(msg, data) {

    },
    onLoad() {
        this._initMsg();
        let stage = GameData.selectStage;

        // UIMgr.createPrefabAddToRunningScene(this.previewPre, function (ui) { //添加预览

        //     // ui.parent.getComponent('ComUIBg').bgNode.opacity = 0;
        //     ui.getComponent('Preview').initView();
        // }.bind(this));
        let path = 'resources/map/mapdata' + stage + '.json';
        this._loadJson(path, function (results) {
            this._showBlocks(results.type.layer1.data, this.blockLayer);
        }.bind(this));
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

    _showBlocks(data, parentNode) { //col代表列，row代表行
        console.log('data: ', data);
        let row = data.length;

        for (let i = 0; i < 11; ++i) {
            let rowArr = data[row - 11 + i];
            let col = 11;
            for (let j = 0; j < col; ++j) {
                if (data[row - 11 + i][j] !== 0) {
                    let blockPre = cc.instantiate(this.blockPre);
                    this.blockLayer.addChild(blockPre);
                    let w = parentNode.width;
                    // let h = parentNode.height;
                    let offset = blockPre.width / 10;
                    blockPre.width = blockPre.height = w / col - offset;
                    let tempWidth = w / col;
                    blockPre.x = (j - Math.floor(col / 2)) * tempWidth;
                    blockPre.y = -i * tempWidth - tempWidth / 2;
                    blockPre.getComponent('Block').initView(data[row - 11 + i][j]);
                }
            }
        }
    },


});