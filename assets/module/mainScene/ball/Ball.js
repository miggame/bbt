let ObserverMgr = require('ObserverMgr');
let GameLocalMsg = require('GameLocalMsg');
let GameData = require('GameData');

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
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.BallEndPos, endP);
                    this._hitGround = 0;
                    self.node.destroy();
                }
                break;
            case 3: //球碰到托盘

                break;
            case 4: //球碰到墙

                break;
        }
    },

    applySpeed(angle) {
        let _phyBody = this.node.getComponent(cc.RigidBody);
        let speed = _phyBody.linearVelocity;
        speed.y = GameData.ballSpeed * Math.sin(angle);
        speed.x = GameData.ballSpeed * Math.cos(angle);
        _phyBody.linearVelocity = speed;
    }
});