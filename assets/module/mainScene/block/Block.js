let UIMgr = require('UIMgr');
let Observer = require('Observer');
let GameLocalMsg = require('GameLocalMsg');

cc.Class({
    extends: Observer,

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
        _hp: null,
        _type: null,
        _over: null,
        _index: null,
        _status: false,
        spLeft: {
            displayName: 'spLeft',
            default: null,
            type: cc.Sprite
        },
        spRight: {
            displayName: 'spRight',
            default: null,
            type: cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:
    _getMsgList() {
        return [
            GameLocalMsg.Msg.EffectPos
        ];
    },
    _onMsg(msg, data) {
        if (msg === GameLocalMsg.Msg.EffectPos) {
            let scoreBlockTypeArr = [1, 2, 3, 4, 5, 6];
            if (data.type === 7) {
                if (this.node.y === data.pos.y && scoreBlockTypeArr.indexOf(this._type) !== -1) {
                    this._hp--;
                    this._refreshHp();
                }
            } else if (data.type === 8) {
                if (this.node.x === data.pos.x && scoreBlockTypeArr.indexOf(this._type) !== -1) {
                    this._hp--;
                    this._refreshHp();
                }
            }
        }
    },
    onLoad() {
        this._initMsg();
    },

    start() {

    },

    // update (dt) {},

    initView(type, baseScore, index) { //type:12为合上，13为分开
        this._index = index;
        this._type = type;
        let path = 'game/game_img_block' + type + '_1';
        if (type === 11 || type === 12 || type === 13) {
            path = 'game/game_img_block1_1';
        }
        // if (type == 20) {
        //     UIMgr.changeSpImg(path, this.spBlock);
        // }
        if (type == 20) {
            this.schedule(function () {
                console.log('this.spBlock.node: ', this.spBlock.node);
            }, 0.1);

        }
        // UIMgr.changeSpImg(path, this.spBlock);

        let w = this.node.width;
        let h = this.node.height;
        this.lblHp.node.active = true;
        if (baseScore !== null || baseScore !== undefined) {
            this._hp = parseInt(baseScore);
            this._refreshHp();
        }
        if (type === 20) {
            this.lblHp.node.active = false;
        } else if (type === 0 || type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8) {
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
        } else if (type === 11) {
            this._over = false;
            if (baseScore !== null || baseScore !== undefined) {
                this._hp = parseInt(2 * baseScore);
                this._refreshHp();
            }
        } else if (type === 12 || type === 13) {
            this._initSide(type);
        } else {
            this._over = false;
            if (baseScore !== null || baseScore !== undefined) {
                this._hp = parseInt(type * baseScore);
                this._refreshHp();
            }
        }
        this._initPhysics(type);
    },

    initPreview(type) {
        let path = 'game/game_img_block' + type + '_1';
        if (type === 11 || type === 12 || type === 13) {
            path = 'game/game_img_block1_1';
        }
        UIMgr.changeSpImg(path, this.spBlock);
        this.lblHp.node.active = false;
        if (type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8) {
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
        if (type === 21 || type === 22 || type === 23 || type === 24 || type === 7 || type === 8) {
            this.node.getComponent(cc.PhysicsPolygonCollider).sensor = true;
        }
        this.node.getComponent(cc.PhysicsPolygonCollider).tag = 1;
        this.node.getComponent(cc.PhysicsPolygonCollider).points = pointsArr;
        this.node.getComponent(cc.PhysicsPolygonCollider).apply();
    },

    _refreshHp(flag = true) {
        let arr = [21, 22, 23, 24, 7, 8, 9];
        if (arr.indexOf(this._type) !== -1) {
            return;
        }
        if (this._hp <= 0) {
            this.node.destroy();
            // this.node.removeFromParent(); //???TODO
        }
        this.lblHp.string = this._hp;
    },
    _initSide(type) { //type:12关闭状态，13打开状态
        this.node.stopAllActions();
        this.spRight.node.active = this.spLeft.node.active = true;
        if (type === 12) {
            this._status = false;
            this.spRight.node.x = 0;
            this.spLeft.node.x = 0;
            return;
        } else if (type === 13) {
            this._status = true;
            this.spLeft.node.x = -this.spLeft.node.width / 2;
            this.spRight.node.x = this.spLeft.node.width / 2;
        }
    },

    playAct() { //type:open, close
        let d = this.spLeft.node.width / 2;
        let leftAct = cc.moveBy(0.1, cc.p(-d, 0));
        let rightAct = cc.moveBy(0.1, cc.p(d, 0));
        let leftReverseAct = leftAct.reverse();
        let rightReverseAct = rightAct.reverse();
        if (this._status === false) {
            this._status = true;
            this.spLeft.node.runAction(leftAct);
            this.spRight.node.runAction(rightAct);
        } else if (this._status === true) {
            this._status = false;
            this.spLeft.node.runAction(leftReverseAct);
            this.spRight.node.runAction(rightReverseAct);
        }
    }
});