let ObserverMgr = require('ObserverMgr');
let GameLocalMsg = require('GameLocalMsg');

cc.Class({
    extends: cc.Component,

    properties: {
        _hitGround: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this._hitGround = 0;
    },

    start() {

    },

    // update (dt) {},

    onBeginContact(contact, self, other) { //tag:block-1,ground-2,wall-3
        // console.log('other.tag: ', other.tag);
        switch (other.tag) {
            case 1: //球碰到砖块
                let blockScipt = other.node.getComponent('Block');
                blockScipt._hp--;
                blockScipt._refreshHp(false);
                break;
            case 2: //球碰到地面
                this._hitGround++;
                if (this._hitGround >= 2) {
                    let worldManifold = contact.getWorldManifold();
                    let points = worldManifold.points;
                    let endP = this.node.parent.convertToNodeSpaceAR(points[0]);
                    // self.node.removeFromParent();
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BallEndPos, endP);
                    this._hitGround = 0;
                    // self.node.removeComponent(cc.PhysicsCircleCollider);
                    self.node.destroy();
                }
                break;
            case 3: //球碰到托盘

                break;
            case 4: //球碰到墙

                break;
        }
    }
});