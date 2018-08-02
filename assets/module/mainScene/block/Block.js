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
        if (baseScore !== null || baseScore !== undefined) {
            this.lblHp.string = parseInt(baseScore);
        }
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
            if (baseScore !== null || baseScore !== undefined) {
                this.lblHp.string = parseInt(type * baseScore);
            }
        }
        // if (flag === false) {
        //     this.lblHp.node.active = false;
        // }
        this._initPhysics(type);
    },

    initPreview(type) {
        let path = 'game/game_img_block' + type + '_1';
        UIMgr.changeSpImg(path, this.spBlock);
        this.lblHp.node.active = false;
        if (type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8 || type === 9) {
            // this.spBlock.node.getComponent(cc.Widget).enabled = false;
            this.node.scale = 0.5;
        }
    },

    _initPhysics(type) {
        let w = this.node.width / 2;
        let h = this.node.height / 2;
        let p0 = cc.p(-w, -h);
        let p1 = cc.p(w, -h);
        let p2 = cc.p(w, h);
        let p3 = cc.p(-w, h);
        let pointsArr = [];
        if (type === 3) {
            pointsArr = [p0, p1, p3];
        } else if (type === 4) {
            pointsArr = [p0, p1, p2];
        } else if (type === 5) {
            pointsArr = [p1, p2, p3];
        } else if (type === 6) {
            pointsArr = [p0, p2, p3];
        } else {
            pointsArr = [p0, p1, p2, p3];
        }
        this.node.addComponent(cc.PhysicsPolygonCollider);
        this.node.getComponent(cc.PhysicsPolygonCollider).points = pointsArr;
        this.node.getComponent(cc.PhysicsPolygonCollider).apply();
    }
});