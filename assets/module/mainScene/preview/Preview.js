// let GameData = require('GameData');
let UIMgr = require('UIMgr');

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
        previewLogo: {
            displayName: 'previewLogo',
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    initView(data) {
        this.node.y += cc.view.getVisibleSize().height / 4;
        this._showPreviewBlocks(data, this.blockLayer);
    },

    // update (dt) {},
    // _loadJson(stage, cb) {
    //     let path = 'resources/map/mapdata' + stage + '.json';
    //     let url = cc.url.raw(path);
    //     cc.loader.load(url, function (err, results) {
    //         if (err) {
    //             console.log('err: ', err);
    //             return;
    //         }
    //         cb(results);
    //     });
    // },

    _showPreviewBlocks(data, parentNode) { //col代表列，row代表行
        let row = data.length;
        let col = data[0].length;
        let w = parentNode.width;

        for (let i = 0; i < row; ++i) {
            // let col = data[i].length;
            for (let j = 0; j < col; ++j) {
                if (data[i][j] !== 0) {
                    let blockPre = cc.instantiate(this.blockPre);
                    parentNode.addChild(blockPre);
                    blockPre.width = w / col;
                    blockPre.height = blockPre.width;
                    blockPre.x = (j - Math.floor(col / 2)) * blockPre.width;
                    blockPre.y = -i * blockPre.height;
                    blockPre.getComponent('Block').initPreview(data[i][j]);
                }
            }
        }
        // parentNode.parent.anchorY = 1;
        parentNode.parent.height = w / col * row;
        this.previewLogo.node.setLocalZOrder(this.blockLayer.childrenCount);
        this.scheduleOnce(function () {
            UIMgr.destroyUI(this);
        }.bind(this), 3);
    },
});