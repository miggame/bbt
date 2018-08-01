let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        blockLayer: {
            displayName: 'blockLayer',
            default: null,
            type: cc.Node
        },
        blockPre: {
            displayName: 'blockPre',
            default: null,
            type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    initView(data) {
        console.log('data: ', data);
        this._showPreviewBlocks(data, this.blockLayer);
    },

    // update (dt) {},
    _loadJson(stage, cb) {
        let path = 'resources/map/mapdata' + stage + '.json';
        let url = cc.url.raw(path);
        cc.loader.load(url, function (err, results) {
            if (err) {
                console.log('err: ', err);
                return;
            }
            cb(results);
        });
    },

    _showPreviewBlocks(data, parentNode) { //col代表列，row代表行

        let row = data.length;
        for (let i = 0; i < row; ++i) {
            // let rowArr = data[i];
            let col = data[i].length;
            for (let j = 0; j < col; ++j) {
                if (data[i][j] !== 0) {
                    let blockPre = cc.instantiate(this.blockPre);
                    parentNode.addChild(blockPre);
                    let w = parentNode.width;
                    let h = parentNode.height;
                    blockPre.width = w / col;
                    blockPre.height = blockPre.width;
                    blockPre.x = (j - Math.floor(col / 2)) * blockPre.width;
                    blockPre.y = -i * blockPre.height;
                    // blockPre.y = (Math.floor(row / 2) - i) * blockPre.height;
                    blockPre.getComponent('Block').initView(data[i][j]);
                }
            }
        }
    },
});