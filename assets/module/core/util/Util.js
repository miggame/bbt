module.exports = {
    _loadJson(path, cb) {
        let url = cc.url.raw(path);
        cc.loader.load(url, function (err, results) {
            if (err) {
                console.log('err: ', err);
                return;
            }
            cb(results);
        });
    },
};