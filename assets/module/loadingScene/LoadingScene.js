let Util = require('Util');
let GameData = require('GameData');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let path = 'map';
        Util.loadJsonDir(path, function (res, urls) {
            GameData.gamedata_savelv = res.shift();
            GameData.gamedata_map = res;
            cc.director.loadScene('MenuScene');
        }.bind(this));
    },

    start() {

    },

    // update (dt) {},

});