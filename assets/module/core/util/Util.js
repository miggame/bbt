module.exports = {
    loadJson(path, cb) {
        let url = cc.url.raw(path);
        cc.loader.load(url, function (err, results) {
            if (err) {
                console.log('err: ', err);
                return;
            }
            cb(results);
        });
    },
    loadJsonDir(path, cb) {
        cc.loader.loadResDir(path, function (err, res, urls) {
            if (err) {
                console.log('err: ', err);
                return;
            }
            if (cb === null || cb === undefined) {
                return;
            }
            cb(res, urls);
        }.bind(this));
    },

};