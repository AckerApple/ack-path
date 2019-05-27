"use strict";
exports.__esModule = true;
var file_1 = require("./file");
var index_1 = require("./index");
exports.weave = {
    file: function (file) {
        exports.weave.file = function (file) { return file_1.method(file); };
        return file_1.method(file);
    },
    path: function (path) {
        exports.weave.path = function (path) { return index_1.method(path); };
        return index_1.method(path);
    }
};
