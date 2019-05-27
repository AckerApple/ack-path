"use strict";
exports.__esModule = true;
var isExistsError = require('./index').isExistsError;
var fs = require("fs");
var nodePath = require("path");
var weave_1 = require("./weave"); //contains access to ack.path
var mime = require("mime");
var mv = require("mv"); //recursive delete directories
var File = function (path) {
    this.path = path && path.constructor == File ? path.path : path;
};
File.prototype.moveTo = function (newPath, overwrite) {
    var _this = this;
    var NewPath = new File(newPath);
    var promise = Promise.resolve();
    if (overwrite) {
        promise = NewPath["delete"]()["catch"](function (e) {
            if (isExistsError(e)) {
                return null;
            }
            return Promise.reject(e);
        });
    }
    return promise.then(function () {
        return new Promise(function (res, rej) {
            mv(_this.path, NewPath.path, function (err, value) {
                if (err) {
                    return rej(err);
                }
                res(value);
            });
        });
        //return fs.rename(this.path,nPath,cb)
    });
};
File.prototype.rename = File.prototype.moveTo;
/** returns promise of File object that is targeted at created copy  */
File.prototype.copyTo = function (pathTo) {
    var WriteTo = new File(pathTo);
    var writeTo = WriteTo.path; //incase is path object
    var from = this.path;
    return weave_1.weave.path(writeTo).join('../').param()
        .then(function () {
        return copyFile(from, writeTo);
    })
        .then(function () { return WriteTo; });
};
/** Manipulates path by removing one file extension. Returns self */
File.prototype.removeExt = function () {
    this.path = this.path.replace(/\.[^.\/]+$/, '');
    return this;
};
/** Creates new File instance with existing file path prepended. Leaves existing reference alone */
File.prototype.Join = function (a, b, c) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.path);
    return new File(nodePath.join.apply(nodePath, args));
};
/** appends onto existing file path */
File.prototype.join = function (a, b, c) {
    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.path);
    this.path = nodePath.join.apply(nodePath, args);
    return this;
};
//callback(error,result)
File.prototype.requireIfExists = function () {
    var path = this.path;
    return this.ifExists().then(function (res) {
        if (res) {
            return require(path);
        }
    });
};
File.prototype.readJson = function () {
    return this.readAsString().then(JSON.parse);
};
File.prototype.getJson = File.prototype.readJson; //aka
File.prototype.ifExists = function (cb, els) {
    els = els || function () { };
    cb = cb || function () { };
    return this.exists()
        .then(function (res) {
        if (res) {
            cb();
            return res;
        }
        els();
        return res;
    });
};
File.prototype.Path = function () {
    return weave_1.weave.path(this.path).join('../');
};
//recursively creates paths
File.prototype.paramDir = function (options) {
    var _this = this;
    return this.Path().paramDir().then(function () { return _this; });
};
File.prototype.stat = function () {
    var path = this.path;
    return new Promise(function (res, rej) {
        fs.stat(path, function (err, value) {
            if (err) {
                return rej(err);
            }
            res(value);
        });
    });
};
File.prototype.getMimeType = function () {
    return mime.getType(this.path);
};
File.prototype.read = function () {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.readFile(_this.path, function (err, value) {
            if (err) {
                return rej(err);
            }
            res(value);
        });
    });
};
File.prototype.readAsBase64 = function () {
    return this.read(this.path).then(function (buffer) { return buffer.toString('base64'); });
};
File.prototype.readAsString = function () {
    return this.read().then(function (res) { return res.toString(); });
};
File.prototype.getName = function () {
    return this.path.replace(/^.+[\\/]+/g, '');
};
File.prototype.append = function (output) {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.appendFile(_this.path, output, function (err) {
            if (err) {
                return rej(err);
            }
            res();
        });
    });
};
File.prototype.write = function (output) {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.writeFile(_this.path, output, function (err) {
            if (err) {
                return rej(err);
            }
            res();
        });
    });
};
/** just like write but if file already exists, no error will be thrown */
File.prototype.param = function (output) {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.writeFile(_this.path, output, function (err) {
            if (err) {
                return rej(err);
            }
            res();
        });
    })["catch"](function (e) {
        if (isExistsError(e)) {
            return null;
        }
        return Promise.reject(e);
    });
};
File.prototype["delete"] = function () {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.unlink(_this.path, function (err) {
            if (err) {
                return rej(err);
            }
            res();
        });
    })["catch"](function (e) {
        if (isExistsError(e)) {
            return null;
        }
        return Promise.reject(e);
    });
};
File.prototype.exists = function (cb) {
    var _this = this;
    return new Promise(function (res, rej) {
        fs.lstat(_this.path, function (err, value) {
            res(err ? false : true);
        });
    });
};
File.prototype.sync = function () {
    return new FileSync(this.path);
};
//synchron
var FileSync = function FileSync(path) {
    this.path = path;
};
FileSync.prototype.moveTo = function (pathTo) {
    return fs.renameSync(this.path, pathTo);
};
FileSync.prototype.rename = FileSync.prototype.moveTo;
FileSync.prototype.read = function () {
    return fs.readFileSync(this.path);
};
FileSync.prototype.write = function (string, options) {
    fs.writeFileSync(this.path, string, options);
    return this;
};
FileSync.prototype["delete"] = function () {
    fs.unlinkSync(this.path);
    return this;
};
FileSync.prototype.exists = function () {
    return fs.existsSync(this.path);
};
FileSync.prototype.readJson = function () {
    var contents = this.read();
    return JSON.parse(contents);
};
FileSync.prototype.readAsString = function () {
    return this.read().toString();
};
exports.method = function (path) { return new File(path); };
exports.Class = File;
function copyFile(source, target) {
    return new Promise(function (res, rej) {
        var cbCalled = false;
        var rd = fs.createReadStream(source);
        rd.on("error", function (err) {
            rej(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function (err) {
            rej(err);
        });
        wr.on("close", function (ex) {
            res();
        });
        rd.pipe(wr);
    });
}
