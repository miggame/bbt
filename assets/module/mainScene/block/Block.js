let UIMgr = require('UIMgr');

cc.Class({
    extends: cc.Component,

    properties: {
        spBlock: {
            displayName: 'spBlock',
            default: null,
            type: cc.Sprite
        },
        lblHp: {
            displayName: 'lblHp',
            default: null,
            type: cc.Label
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},

    initView(type, baseScore) {
        let path = 'game/game_img_block' + type + '_1';
        UIMgr.changeSpImg(path, this.spBlock);
        let w = this.node.width;
        let h = this.node.height;
        this.lblHp.node.active = true;
        this.lblHp.string = parseInt(baseScore);
        if (type === 0 || type === 20 || type === 21 || type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8 || type === 9) {
            this.lblHp.node.active = false;
            this.spBlock.node.getComponent(cc.Widget).enabled = false;
            this.spBlock.node.width = this.spBlock.node.width * 0.8;
            this.spBlock.node.height = this.spBlock.node.height * 0.8;
        } else if (type === 3) {
            this.lblHp.node.position = cc.pCompMult(cc.p(w / 2, h / 2), cc.p(-0.3, -0.3));
        } else if (type === 4) {
            this.lblHp.node.position = cc.pCompMult(cc.p(w / 2, h / 2), cc.p(0.3, -0.3));
        } else if (type === 5) {
            this.lblHp.node.position = cc.pCompMult(cc.p(w / 2, h / 2), cc.p(0.3, 0.3));
        } else if (type === 6) {
            this.lblHp.node.position = cc.pCompMult(cc.p(w / 2, h / 2), cc.p(-0.3, 0.3));
        } else {
            this.lblHp.string = parseInt(type * baseScore);
        }

    }
});