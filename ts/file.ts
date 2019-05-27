import * as fs from 'fs'
import * as nodePath from 'path'
import { weave } from './weave'//contains access to ack.path
import * as mime from 'mime'
import * as mv from 'mv'//recursive delete directories

import { isExistsError } from './index'

export class File{
  path:string

  constructor(path){
    this.path = path && path.constructor==File ? path.path : path
  }

  moveTo(newPath, overwrite){
    var NewPath = new File(newPath)
    let promise:Promise<any> = Promise.resolve()

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
  
  rename = this.moveTo

  /** returns promise of File object that is targeted at created copy  */
  copyTo(pathTo){
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
  removeExt(){
    this.path = this.path.replace(/\.[^.\/]+$/,'');return this
  }

  /** Creates new File instance with existing file path prepended. Leaves existing reference alone */
  Join(a,b,c){
    var args = Array.prototype.slice.call(arguments)
    args.unshift(this.path)
    return new File( nodePath.join.apply(nodePath, args) )
  }

  /** appends onto existing file path */
  join(a,b,c){
    var args = Array.prototype.slice.call(arguments)
    args.unshift(this.path)
    this.path = nodePath.join.apply(nodePath, args);return this
  }

  //callback(error,result)
  requireIfExists(){
    var path = this.path

    return this.ifExists().then(res=>{
      if( res ){
        return require(path)
      }
    })
  }

  readJson(){
    return this.readAsString().then(JSON.parse)
  }
  getJson = this.readJson//aka

  ifExists(cb?,els?){
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

  Path(){
    return weave.path(this.path).join('../')
  }

  //recursively creates paths
  paramDir(){
    return this.Path().paramDir().then(()=>this)
  }

  stat(){
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

  getMimeType(){
    return mime.getType(this.path)
  }

  read(){
    return new Promise((res,rej)=>{
      fs.readFile(this.path,(err,value)=>{
        if( err ){
          return rej( err )
        }
        res( value )
      })
    })
  }

  readAsBase64(){
    return this.read().then(buffer=>buffer.toString())
    //return this.read().then(buffer=>buffer.toString('base64'))
  }

  readAsString(){
    return this.read().then(res=>res.toString())
  }

  getName(){
    return this.path.replace(/^.+[\\/]+/g,'')
  }

  append(output){
    return new Promise((res,rej)=>{
      fs.appendFile(this.path, output, (err)=>{
        if( err ){
          return rej(err)
        }
        res()
      })
    })
  }

  write(output){
    return new Promise((res,rej)=>{
      fs.writeFile(this.path,output,(err:Error)=>{
        if( err ){
          return rej( err )
        }
        res()
      })
    })
  }

  /** just like write but if file already exists, no error will be thrown */
  param(output){
    return new Promise((res,rej)=>{
      fs.writeFile(this.path,output,(err)=>{
        if( err ){
          return rej(err)
        }
        res()
      })
    })
    .catch(e=>{
      if( isExistsError(e) ){
        return null
      }
      return Promise.reject(e)
    })
  }

  delete(){
    return new Promise((res,rej)=>{
      fs.unlink(this.path,(err:Error)=>{
        if( err ){
          return rej( err )
        }
        res()
      })
    })
    .catch(e=>{
      if( isExistsError(e) ){
        return null
      }
      return Promise.reject(e)
    })
  }

  exists(){
    return new Promise((res,rej)=>{
      fs.lstat(this.path,(err,value)=>{
        res( err ? false : true )
      })
    })
  }

  sync(){
    return new FileSync(this.path)
  }

}





//synchron
export class FileSync{
  path:string

  constructor(path){
    this.path = path
  }

  moveTo( pathTo ){
    return fs.renameSync(this.path, pathTo)
  }
  rename = this.moveTo

  read():Buffer{
    return fs.readFileSync(this.path)
  }

  write(string,options){
    fs.writeFileSync(this.path, string, options);return this
  }

  delete(){
    fs.unlinkSync(this.path);return this
  }

  exists(){
    return fs.existsSync(this.path)
  }

  readJson(){
    var contents = this.readAsString()
    return JSON.parse( contents )
  }

  readAsString(){
    return this.read().toString()
  }
}

export const method = function(path){return new File(path)}
export const Class = File








function copyFile(source, target) {
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