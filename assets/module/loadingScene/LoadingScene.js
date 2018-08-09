let Util = require('Util');
let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        let path = 'map';
        Util.loadJsonDir(path, function (res, urls) {
            GameData.gamedata_savelv = res.shift();;
            GameData.gamedata_map = res;
            cc.director.loadScene('MenuScene');
        }.bind(this));
    },

    start() {

    },

    // update (dt) {},

});