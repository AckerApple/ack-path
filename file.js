"use strict";
var fs = require('fs'),
  nodePath = require('path'),
  ack = require('ack-x'),
  weave = require('./weave'),//contains access to ack.path
  mime = require('mime')

var File = function(path){
  this.path = path && path.constructor==File ? path.path : path
  return this
}

/** returns promise of File object that is targeted at created copy  */
File.prototype.copyTo = function(pathTo){
  const WriteTo = new File(pathTo)
  const writeTo = WriteTo.path//incase is path object
  const from = this.path

  return weave.path(writeTo).join('../').param()
  .then(function(){
    return copyFile(from, writeTo)
  })
  .set(WriteTo)
}

/** Manipulates path by removing one file extension. Returns self */
File.prototype.removeExt = function(){
  this.path = this.path.replace(/\.[^.\/]+$/,'');return this
}

/** Creates new File instance with existing file path prepended. Leaves existing reference alone */
File.prototype.Join = function(a,b,c){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(this.path)
  return new File( nodePath.join.apply(nodePath, args) )
}

/** appends onto existing file path */
File.prototype.join = function(a,b,c){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(this.path)
  this.path = nodePath.join.apply(nodePath, args);return this
}

//callback(error,result)
File.prototype.requireIfExists = function(){
  var path = this.path

  return ack.promise()
  .next(function(next){
    this.ifExists(function(){
      next(require(path))
    },function(){
      next()
      /*
      var e = new Error()
      e.name = 'FileNotFound'
      next.promise.throw(e)
      */
    })
  },this)
}

File.prototype.readJson = function(){
  return this.readAsString().then(JSON.parse)
}
File.prototype.getJson = File.prototype.readJson//aka

File.prototype.ifExists = function(cb,els){
  els = els||function(){}
  cb = cb||function(){}

  this.exists()
  .if(true,cb,this)
  .if(false,els,this)

  return this
}

File.prototype.Path = function(){
  return weave.path(this.path).join('../')
}

//recursively creates paths
File.prototype.paramDir = function(options){
  return this.Path().paramDir().set(this)
}

File.prototype.stat = function(){
  return ack.promise().set(this.path).callback(fs.stat)
}

File.prototype.getMimeType = function(){
  return mime.lookup(this.path)
}

File.prototype.read = function(){
  return ack.promise().set(this.path).callback(fs.readFile)
}

File.prototype.readAsBase64 = function(){
  return this.read(this.path).then(buffer=>buffer.toString('base64'))
}

File.prototype.readAsString = function(){
  return this.read().call('toString')
}

File.prototype.getName = function(){
  return this.path.replace(/^.+[\\/]+/g,'')
}

File.prototype.append = function(output){
  return ack.promise().set(this.path, output).callback(fs.appendFile)
}

File.prototype.write = function(output){
  return ack.promise().set(this.path,output).callback(fs.writeFile)//.then(function(){return this},this)
}

/** just like write but if file already exists, no error will be thrown */
File.prototype.param = function(output){
  return ack.promise()
  .set(this.path,output)
  .callback(fs.writeFile)//.then(function(){return this},this)
  .catch('ENOENT',function(){})
}

File.prototype.delete = function(){
  return ack.promise().set(this.path).callback(function(r, callback){
    ack.promise().set(r).callback(fs.unlink).then(callback)
    .catch('ENOENT',function(){//file did not exists, no big deal
      callback()
    })
  })
}

File.prototype.exists = function(cb){
  return ack.promise().set(this.path).next(fs.exists)
}

File.prototype.sync = function(){
  return new FileSync(this.path)
}





//synchron
var FileSync = function FileSync(path){
  this.path = path
  return this
}

FileSync.prototype.read = function(){
  return fs.readFileSync(this.path)
}

FileSync.prototype.write = function(string,options){
  fs.writeFileSync(this.path, string, options);return this
}

FileSync.prototype.delete = function(){
  fs.unlinkSync(this.path);return this
}

FileSync.prototype.exists = function(){
  return fs.existsSync(this.path)
}

FileSync.prototype.readJson = function(){
  var contents = this.read()
  return JSON.parse(contents)
}

module.exports = function(path){return new File(path)}
module.exports.Class = File








function copyFile(source, target, cb) {
  return new Promise(function(res,rej){
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
      rej(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
      rej(err);
    });
    wr.on("close", function(ex) {
      res();
    });
    rd.pipe(wr);
  })
}