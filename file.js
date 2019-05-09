"use strict";
const isExistsError = require('./index').isExistsError
var fs = require('fs'),
  nodePath = require('path'),
  weave = require('./weave'),//contains access to ack.path
  mime = require('mime'),
  mv = require('mv')//recursive delete directories

var File = function(path){
  this.path = path && path.constructor==File ? path.path : path
  return this
}

File.prototype.moveTo = function(newPath, overwrite){
  var NewPath = new File(newPath)
  let promise = Promise.resolve()

  if( overwrite ){
    promise = NewPath.delete()
    .catch(e=>{
      if( isExistsError(e) ){
        return null
      }
      return Promise.reject( e )
    })
  }
  return promise.then(()=>{
    return new Promise((res,rej)=>{
      mv(this.path, NewPath.path, (err,value)=>{
        if( err ){
          return rej(err)
        }
        res( value )
      })
    })
    //return fs.rename(this.path,nPath,cb)
  })
}
File.prototype.rename = File.prototype.moveTo

/** returns promise of File object that is targeted at created copy  */
File.prototype.copyTo = function(pathTo){
  var WriteTo = new File(pathTo)
  var writeTo = WriteTo.path//incase is path object
  var from = this.path

  return weave.path(writeTo).join('../').param()
  .then(function(){
    return copyFile(from, writeTo)
  })
  .then(()=>WriteTo)
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

  return this.ifExists().then(res=>{
    if( res ){
      return require(path)
    }
  })
}

File.prototype.readJson = function(){
  return this.readAsString().then(JSON.parse)
}
File.prototype.getJson = File.prototype.readJson//aka

File.prototype.ifExists = function(cb,els){
  els = els||function(){}
  cb = cb||function(){}

  return this.exists()
  .then(res=>{
    if( res ){
      cb()
      return res
    }
    
    els()
    return res
  })
}

File.prototype.Path = function(){
  return weave.path(this.path).join('../')
}

//recursively creates paths
File.prototype.paramDir = function(options){
  return this.Path().paramDir().then(()=>this)
}

File.prototype.stat = function(){
  const path = this.path
  return new Promise(function(res,rej){
    fs.stat(path, function(err, value){
      if( err ){
        return rej(err)
      }
      res(value)
    })
  })
}

File.prototype.getMimeType = function(){
  return mime.getType(this.path)
}

File.prototype.read = function(){
  return new Promise((res,rej)=>{
    fs.readFile(this.path,(err,value)=>{
      if( err ){
        return rej( err )
      }
      res( value )
    })
  })
}

File.prototype.readAsBase64 = function(){
  return this.read(this.path).then(buffer=>buffer.toString('base64'))
}

File.prototype.readAsString = function(){
  return this.read().then(res=>res.toString())
}

File.prototype.getName = function(){
  return this.path.replace(/^.+[\\/]+/g,'')
}

File.prototype.append = function(output){
  return new Promise((res,rej)=>{
    fs.appendFile(this.path, output, (err,value)=>{
      if( err ){
        return rej(err)
      }
      res( value )
    })
  })
}

File.prototype.write = function(output){
  return new Promise((res,rej)=>{
    fs.writeFile(this.path,output,(err,value)=>{
      if( err ){
        return rej( err )
      }
      res( value )
    })
  })
}

/** just like write but if file already exists, no error will be thrown */
File.prototype.param = function(output){
  return new Promise((res,rej)=>{
    fs.writeFile(this.path,output,(err,value)=>{
      if( err ){
        return rej(err)
      }
      res( value )
    })
  })
  .catch(e=>{
    if( isExistsError(e) ){
      return null
    }
    return Promise.reject(e)
  })
}

File.prototype.delete = function(){
  return new Promise((res,rej)=>{
    fs.unlink(this.path,(err,value)=>{
      if( err ){
        return rej( err )
      }
      res( value )
    })
  })
  .catch(e=>{
    if( isExistsError(e) ){
      return null
    }
    return Promise.reject(e)
  })
}

File.prototype.exists = function(cb){
  return new Promise((res,rej)=>{
    fs.lstat(this.path,(err,value)=>{
      res( err ? false : true )
    })
  })
}

File.prototype.sync = function(){
  return new FileSync(this.path)
}





//synchron
var FileSync = function FileSync(path){
  this.path = path
  return this
}

FileSync.prototype.moveTo = function( pathTo ){
  return fs.renameSync(this.path, pathTo)
}
FileSync.prototype.rename = FileSync.prototype.moveTo

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

FileSync.prototype.readAsString = function(){
  return this.read().toString()
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