module.exports = {
    player: {
        ruby: 300,
        ballTime: 21,
        star: 25
    },
    game: {
        oriStage: 1,
        curStage: 1
    },
    viewW: cc.view.getVisibleSize().width,
    viewH: cc.view.getVisibleSize().height,
    selectStage: 1,
    ballSpeed: 1000,
    ballCount: 15,
    baseScore: 10,
    multScore: 0,

    resetMultScore() {
        this.multScore = 0;
    },

    getScore() {
        return this.multScore * this.baseScore;
    }
}