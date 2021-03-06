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

                let block = other.node;
                let blockScipt = block.getComponent('Block');
                let type = blockScipt._type;

                if (type === 21 || type === 22 || type === 23) {
                    this._plusBall(block, type);
                    return;
                } else if (type === 7 || type === 8) {
                    let data = {
                        pos: other.node.position,
                        type: type,
                        uuid: other.node.uuid
                    };
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.EffectPos, data);
                } else if (type === 24) {
                    let _velocity = self.body.linearVelocity;
                    let _angleArr = [Math.PI / 3, Math.PI / 2, Math.PI / 3 * 2];
                    let _angle = _angleArr[Math.floor(cc.rand() % 3)];
                    _velocity.x = GameData.ballSpeed * Math.cos(_angle);
                    _velocity.y = GameData.ballSpeed * Math.sin(_angle);

                    self.body.linearVelocity = _velocity;
                    let data = {
                        pos: other.node.pos,
                        type: type,
                        uuid: other.node.uuid
                    };
                    ObserverMgr.dispatchMsg(GameLocalMsg.Msg.SpeedUp, data);
                } else {
                    this._minusBlock(block);
                }
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
    },

    _plusBall(block, type) {
        if (type === 21 || type === 22 || type === 23) {
            let pos = block.position;
            let parentH = block.parent.height;
            let otherH = block.getChildByName('spBlock').height;
            let tarPos = cc.v2(pos.x, -parentH + otherH / 2);
            block.removeComponent(cc.PhysicsCircleCollider);
            block.removeComponent(cc.RigidBody);
            block.runAction(cc.sequence(cc.moveTo(0.3, tarPos), cc.scaleTo(0.3, 0), cc.removeSelf()));
            let _plusBallNum = null;
            if (type === 21) {
                _plusBallNum = 1;
            } else if (type === 22) {
                _plusBallNum = 2;
            } else if (type === 23) {
                _plusBallNum = 3;
            }
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PlusBall, _plusBallNum);
        }
    },

    _minusBlock(block) {
        let blockScipt = block.getComponent('Block');
        let type = blockScipt._type;
        let status = blockScipt._status;
        if ((type === 12 || type === 13 || type === 16 || type === 17) && status === false) {
            return;
        }
        blockScipt._hp--;
        if (blockScipt._hp <= 0 && blockScipt._over === false) {
            GameData.multScore++;
            let score = GameData.getScore();
            blockScipt._over = true;
            ObserverMgr.dispatchMsg(GameLocalMsg.Msg.PlusScore, score);
            // block.destroy();
            if (blockScipt._type === 9) {
                let row = blockScipt._index.x;
                ObserverMgr.dispatchMsg(GameLocalMsg.Msg.Boom, row);
            }
            return;
        }
        blockScipt._refreshHp(false);
    },
});