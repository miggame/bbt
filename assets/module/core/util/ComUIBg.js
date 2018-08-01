
cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: { displayName: 'bgNode', default: null, type: cc.Node },

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        this.bgNode.width = w;
        this.bgNode.height = h;
    },

    start() {

    },

    // update (dt) {},

    addUI(ui) {
        let node = cc.instantiate(ui);
        node.x = node.y = 0;
        this.node.addChild(node);
        return node;
    }
});
