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
    ballSpeed: 1500,
    ballCount: 15,
    baseScore: 10,
    multScore: 0,
    defaultCol: 11,

    starLevel: null, //map类型
    gamedata_savelv: null,
    gamedata_map: null,
    stageData: null,

    init() {
        if (this.starLevel === null) {
            this.starLevel = new Map();
        }
        this.game.curStage = this.getCurStage();
        if (this.game.curStage === null || this.game.curStage === undefined) {
            this.game.curStage = 1;
        }
    },
    resetMultScore() {
        this.multScore = 0;
    },

    getScore() {
        return this.multScore * this.baseScore;
    },

    getBallCount() {
        this.ballCount = this.gamedata_savelv['stageinfo' + this.selectStage][0];
        return this.ballCount;
    },

    getStageData() {
        this.stageData = this.gamedata_map[this.selectStage - 1];
        return this.stageData;
    },

    saveCurStage(stage) {
        cc.sys.localStorage.setItem('curStage', stage);
    },

    getCurStage() {
        return cc.sys.localStorage.getItem('curStage');
    },
}