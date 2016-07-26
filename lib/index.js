var exec = require('child_process').exec;

exports.openUrl = function (url) {
    exec((isWindows() ? 'start' : 'open') + url);
};

function isWindows() {
    return /^win/.test(process.platform);
}
