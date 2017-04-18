"use strict";
var fs = require('fs')
  ,path = require('path')
  ,ack = require('ack-x')
  ,nodeDir = require('node-dir')//consider replacing with "readdirp"
  ,weave = require('./weave')//contains access to ack.file
  ,mkdirp = require('mkdirp')//recursive create directories
  ,rimraf = require('rimraf')//recursive delete directories
  ,mv = require('mv')//recursive delete directories

function Path(path){
  //this.path = path
  this.path = path && path.constructor==Path ? path.path : path
  //this.path = path && path.path ? path.path : path
  //this.new = new NewPath(this)
  //this.string = new PathString(this)
  return this
}

Path.getName = function(p){
  p = p.replace(/\\|\/$/g,'')//remove last slash
  return p.split(/\\|\//).pop()//return last
}

Path.prototype.String = function(){
  return new PathString(this)
}

Path.prototype.getRecurArray = function(options){
  options = options || {}
  options.recursive = true
  options.sync = false
  options.shortName = 'relative'
  return nodeDir.promiseFiles(this.path, 'combine', options)
}

Path.prototype.getRecurPathReport = function(options){
  options = options || {}
  options.recursive = true
  options.sync = false
  options.shortName = 'relative'
  return nodeDir.promiseFiles(this.path, 'all', options)
}

/** overwrites files */
Path.prototype.copyTo = function(pathTo){
  const WriteTo = new Path(pathTo)
  const writeTo = WriteTo.path//incase is path object
  
  return WriteTo.param()
  .then(function(){
    return this.getRecurPathReport()
  }.bind(this))
  .then(function(report){
    return copyToByRecurReport(this.path, writeTo, report)
  }.bind(this))
}

function copyToByRecurReport(from, writeTo, report){
  return ack.promise()
  .map(report.dirs,item=>{
    const copyTo = path.join(writeTo, item)
    const copyFrom = path.join(from,item)
    const NewPath = new Path( path.join(writeTo,item) )
    return NewPath.param().catch('EEXIST',e=>null)
  })
  .map(report.files, item=>{
    const copyTo = path.join(writeTo, item)
    const copyFrom = path.join(from, item)
    const NewFile = new Path(copyTo).file()
    return new Path(copyFrom).file().read().then(buff=>NewFile.write(buff))
  })
}

/** move entire directory or single file */
Path.prototype.moveTo = function(newPath, overwrite){
  const NewPath = new Path(newPath)

  return ack.promise()
  .bind(this)
  .if(()=>overwrite,()=>NewPath.delete())
  .catch('ENOENT',e=>null)
  .callback(function(cb){
    return mv(this.path, NewPath.path, cb)
    //return fs.rename(this.path,nPath,cb)
  })
}

/** in-place rename directory or single file */
Path.prototype.rename = function(newname, overwrite){
  const NewPath = this.Join('../', newname)
  return ack.promise()
  .bind(this)
  .if(()=>overwrite,()=>NewPath.delete())
  .catch('ENOENT',e=>null)
  .callback(function(cb){
    return mv(this.path, NewPath.path, cb)
    //return fs.rename(this.path,NewPath.path,cb)
  })
}

Path.prototype.writeFile = function(output){
  return this.File().write(output)
}

/** performs .join but original object remains untouched */
Path.prototype.Join = function(pathTo, pathToPart2, pathToPart3){
  const args = Array.prototype.slice.call(arguments)
  args.unshift(this.path)
  pathTo = path.join.apply(path,args)
  return new Path(pathTo)
}
Path.prototype.Path = Path.prototype.Path

Path.prototype.file = function(name){
  var p = name ? path.join(this.path,name) : this.path
  return weave.file(p)
}
Path.prototype.File = Path.prototype.file

//access blocking code based methods
Path.prototype.sync = function(){
  return new PathSync(this.path)
}

Path.prototype.getLastName = function(){
  return this.String().getName()
}
Path.prototype.getName = Path.prototype.getLastName

//!Stand alone function, not part of Path Class
Path.noLastSlash = function(path){
  return path.replace(/(\/|\\)$/,'')
}

Path.prototype.noLastSlash = function(){
  this.path = this.String().noLastSlash()
  return this
}

Path.prototype.noFirstSlash = function(){
  this.path = this.String().noFirstSlash()
  return this
}

Path.prototype.up = function(){
  return this.join('../')
}

Path.prototype.join = function(){
  var String = this.String()
  this.path = String.join.apply(String, arguments)
  return this
}

/** removes the file name from path */
Path.prototype.removeFile = function(){
  this.path = this.String().removeFile();
  return this
}
Path.prototype.removeFileName = Path.prototype.removeFile

Path.prototype.removeExt = function(){
  this.path = this.String().removeExt()
  return this
}

Path.prototype.ext = function(ext){
  this.path = this.String().ext(ext)
  return this
}

/* work a path up to root item */
Path.prototype.upEach = function(eachMethod){
  return this.upNext(function(Path,next){
      var r = eachMethod(Path)
      if(r==null || r)next()
  })
}

//makes this object go up a path ../
Path.prototype.upNext = function(method){
  if(this.getDepth()<=1){
    return this
  }

  var $this = this
    method.call(this,this,function(){
    $this.Join('../').upNext(method)
  })

  return this
}

Path.prototype.getDepth = function(){
  var tPath = this.path.replace(/^(\.+)?((\/|\\)+)/,'')
  if(!tPath.length)return 0
  return tPath.split(/\/|\\/).length
}

/** hard-checks file system if item is a folder */
Path.isDirectory = function(target){
  return ack.promise().bind(fs)
  .set(target)
  .callback( fs.lstat )
  .call('isDirectory')
}

Path.prototype.isDirectory = function(){
  return Path.isDirectory(this.path)
}

/** hard-checks file system if item is a file */
Path.prototype.isFile = function(){
  return ack.promise().bind(fs)
  .set(this.path)
  .callback( fs.lstat )
  .call('isFile')
}

Path.isLikeFile = function(targetPath){
  return targetPath ? targetPath.search(/(.+(\/|\\))?[^\/]+\.[^/\.]+$/) > -1 : false
}

Path.prototype.isLikeFile = function(){
  return Path.isLikeFile(this.path)
}

Path.prototype.exists = function(cbOrPath,cb){
  var isArg1String = typeof(cbOrPath)=='string'
    ,callb = isArg1String ? cb : cbOrPath
    ,p = isArg1String ? this.String().join(cbOrPath) : this.path
    ,t=this

  return ack.promise().set(p)
  .next(fs.exists)//.next(fs.stat).set(true).catch(function(){return false})
}

Path.prototype.ifExists = function(pathOrCb,cbOrElse,els){
  var isSubPath = typeof(pathOrCb)=='string'
    ,p = isSubPath ? pathOrCb : null
    ,emp = function(){}
    ,cb = isSubPath ? cbOrElse : pathOrCb

  els = isSubPath ? els||emp : cbOrElse||emp

  this.exists().if(true,cb,this).if(false,els,this)

  return this
}

Path.prototype.require = function(file){
  var filePath = file? path.join(this.path,file) : this.path
  return ack.promise().then(function(){
    return require(filePath)
  })
}

/** creates folder if not defined. Does not consider if defined path is actually a file path */
Path.param = function(folderPath,options){
  return ack.promise()
  .callback(function(callback){
    mkdirp(folderPath,options,callback)
  })
}

/** creates folder if not defined. Takes into consideration if defined path is actually a file path */
Path.prototype.paramDir = function(subPath,options){
  var tarPath = subPath ? path.join(this.path,subPath) : this.path

  if(Path.isLikeFile(tarPath)){
    var tarPath = path.join(tarPath,'../')
  }

  return Path.param(tarPath, options).bind(this)
}

/** creates folder if not defined. Does not consider if defined path is actually a file path */
Path.prototype.param = function(subPath,options){
  var tarPath = subPath ? path.join(this.path,subPath) : this.path
  return Path.param(tarPath, options).bind(this)
}

Path.delete = function(target){
  return Path.isDirectory(target)
  .then(isDir=>{
    if(isDir){
      return ack.promise()
      .callback(function(callback){
        rimraf(target,callback)
      })
    }

    return ack.promise()
    .set(target)
    .callback(function(path,callback){
      fs.unlink(path,callback)
    })
  })
}

Path.prototype.delete = function(subPath){
  var tarPath = subPath ? path.join(this.path,subPath) : this.path
  return Path.delete(tarPath)
}

/** deletes folder. Takes into consideration if defined path is actually a file path */
Path.prototype.deleteDir = function(subPath){
  var tarPath = subPath ? path.join(this.path,subPath) : this.path

  if(Path.isLikeFile(tarPath)){
    var tarPath = path.join(tarPath,'../')
  }

  return Path.delete(tarPath)
}

Path.prototype.getSubDirByName = function(subDirName){
  return this.Join(subDirName)
}

Path.prototype.getSubDirArray = function(){
  return this.getSubDirNameArray()
  .then(sdnArray=>{
    sdnArray.forEach((v,i)=>{
      var SubDir = this.getSubDirByName(v)
      sdnArray[i] = SubDir
    })
    return sdnArray
  })
}

/** returns names of subdirectories */
Path.prototype.getSubDirNameArray = function(){
  return ack.promise().then(()=>nodeDir.promiseFiles(this.path, 'dir', {recursive:false, shortName:true}))
}

/** 
  @callback - function(Path path, parentValue, isFile)
  @options - see Path.each method
*/
Path.prototype.recur = function(callbackOrParentValue, callbackOrOptions, options){
  const callback = callbackOrOptions || callbackOrParentValue
  options = options || (callbackOrOptions.constructor==Function?null:callbackOrOptions)

  const eachDir = v=>{
    const newParentValue = callback.call({quit:'not yet made'},v,callbackOrParentValue,false)
    return v.recur(newParentValue, callback, options)
  }

  return this.eachFilePath( Path=>callback(Path, callbackOrParentValue, true), options )
  .then( ()=>this.getSubDirNameArray() )
  .then( array=>{
    const promises = []
    array.forEach(v=>{
      promises.push( eachDir(this.Join(v)) )
    })
    return ack.promise().all(promises)
  })
}

Path.prototype.eachSubDir = function(callback, last){
  var t = this
  this.getSubDirArray().then(function(array){
    array.forEach(function(v,i){
      return callback.call(t,v,i)
    })
    if(last)last.call(this,array)//deprecated
    return array
  })
  return this
}

Path.prototype.nextSubDir = function(each){
  var $this=this
  return this.getSubDirArray()
  .then(function(array){
    var promise = ack.promise()
    array.forEach(function(v,i){
      promise.next(function(next){
        each.call($this,v,i,next)
      })
    })
    return promise
  })
}

Path.prototype.fileSearchUp = function(fileName){
  var nPath = this.path
  if(fileName){
    nPath = path.join(nPath, fileName)
  }
  return new SearchUpPath(new Path(nPath))
}

/** Recursively loop folder to fire callback for each file found. see eachPath function */
Path.prototype.recurFiles = function(eachCall, options){
  options = options ? options : {}
  options.recursive = true
  return this.eachFilePath(eachCall, options)
}
Path.prototype.recurFilePath = Path.prototype.recurFiles//deprecated name

/** Loop folder to fire callback for each file found. Only produces file results. see eachPath function */
Path.prototype.eachFilePath = function(eachCall, options){
  options = options ? options : {}
  options.INCLUDE_DIRECTORIES=false
  return this.eachPath(eachCall, options)
}


/** see Path.prototype.each function
  @eachCall:function(Object:Path, Number:index)
*/
Path.prototype.eachPath = function(eachCall, options){
  var repeater = function(v,i){
    var NewPath = new Path(v)
    return eachCall(NewPath, i)
  }
  return this.each(repeater, options)
}

/** file/path looper.
  - Based on options, you can recursively read directories and/or files. returns promise
  - Runs using npm package readdir. See npm readdir for more usage instructions.

  @eachCall:function(String:path, Number:index)
  @options: (
    {
      recursive:true,
      INCLUDE_DIRECTORIES:true,
      INCLUDE_HIDDEN:true,
      filter:['** / **.js','** / **.jade']//!remove spaces from example!

      excludeByName:name=>yesNo
    }
  )
*/
Path.prototype.each = function(eachCall, options){
  /*
  var opsNum = Path.castReadOps(options)
    ,filter = options.filter || []
  */

  var searchType = 'all'
  if(options.INCLUDE_DIRECTORIES!=null && !options.INCLUDE_DIRECTORIES){
    searchType = 'file'
  }

  options.shortName = options.shortName==null ? false : options.shortName

  var promise = ack.promise()
  //.set(this.path, filter, opsNum)
  //.bind(readDir)
  //.callback(readDir.read,'')
  .then(()=>nodeDir.promiseFiles(this.path, searchType, options))
  .then(results=>{
    if(results.constructor==Array){
      return results
    }

    //put a slash on all directories
    for(let x=results.dirs.length-1; x >= 0; --x){
      results.dirs[x] = results.dirs[x]+path.sep
    }

    results.files.push.apply(results.files, results.dirs)

    return results.files.map(item=>item.substring(this.path.length+path.sep.length,item.length))
  })
  .bind(this)
  
  //support deprecated method of filtering
  if(options.filter){
    promise = promise.then(results=>{
      var newResults = results.filter(item=>{
        /*
        if(item.substring(item.length-path.sep.length, results.length)==path.sep){
          return true//do not filter directories
        }*/

        for(let x=options.filter.length-1; x >= 0; --x){
          let reg = options.filter[x].replace(/\./g,'\\.')
          reg = reg.replace(/\*/g,'.*')
          reg += '$'//ensure regx match full and not just part of item
          let match = item.search(new RegExp(reg, 'gi'))
          if(match>=0){
            return true
          }
        }
        return false
      })

      return newResults
    })
  }
  
  if(options.excludeByName){
    promise = promise.then( results=>{
      return results.filter((pathTo,i)=>!options.excludeByName(pathTo))
    })
  }
  
  var rtn = []
  promise = promise.each(function(v,i){
    var callres = eachCall.call(this,v,i)

    if(callres!==false){
      rtn.push(callres)
    }
  })
  .then(()=>Promise.all(rtn))

  return promise
}

/** promise */
Path.prototype.eachSubDirName = function(callback){
  return this.getSubDirNameArray().then(array=>{
    array.forEach(function(v,i){
      callback(v,i)
    })
  })
}


//NON PROTOTYPE METHODS
Path.getFilterByReadOps = function(options){
  if(options && options.filter)return options.filter
  return null
}

/*
Path.castReadOps = function(options){
  options = options ? options : {}
  var opResult = 0

  if(options.NON_RECURSIVE==null)
    opResult += readDir.NON_RECURSIVE

  if(options.INCLUDE_DIRECTORIES==null)
    opResult += readDir.INCLUDE_DIRECTORIES

  return opResult
}
*/










//Class dedicated to blocking methods
var PathSync = function PathSync(path){
  this.path = path
  return this
}

PathSync.prototype.delete = function(){
  return rimraf.sync(this.path)
}

PathSync.prototype.isDirectory = function(){
  return fs.lstatSync(this.path).isDirectory()
}
PathSync.prototype.isFolder = PathSync.prototype.isDirectory

PathSync.prototype.isFile = function(){
  return fs.lstatSync(this.path).isFile()
}

/** takes into consideration if path is actually a file */
PathSync.prototype.dirExists = function(appendPath){
  appendPath = appendPath ? path.join(this.path,appendPath) : this.path
  
  if(Path.isLikeFile(appendPath)){
    appendPath = path.join(appendPath,'../')
  }

  return fs.existsSync(appendPath)
}

/** takes into consideration if path is actually a file */
PathSync.prototype.exists = function(appendPath){
  appendPath = appendPath ? path.join(this.path,appendPath) : this.path
/*
  try{
    fs.statSync(filePath);
    return true;
  }catch(err){
    return false;
    //if(err.code == 'ENOENT') return false;
  }
*/
  return fs.existsSync(appendPath)
}

PathSync.prototype.getSubDirNameArray = function(){
  return nodeDir.subdirs(this.path, 'combine', null, {sync:true, shortName:true})
  //return readDir.readSync(this.path, ['*/'], readDir.INCLUDE_DIRECTORIES + readDir.NON_RECURSIVE)
}

/** overwrites */
PathSync.prototype.copyTo = function(pathTo){
  const WriteTo = new Path(pathTo)
  const writeTo = WriteTo.path//incase is path object
  
  try{
    fs.mkdirSync(writeTo)
  }catch(e){
    if(!e.code || e.code!='EEXIST'){
      throw e
    }
  }

  const array = this.getRecurArray()

  for(let x=array.length-1; x >= 0; --x){
    let item = array[x]
    let copyTo = path.join(writeTo, item)
    let copyFrom = path.join(this.path,item)
    let CopyFrom = new Path(this.path).join(item)
    let isDir = CopyFrom.sync().isDirectory()

    if(isDir){
      let newPath = path.join(writeTo,item)
      try{
        fs.mkdirSync( newPath )
      }catch(e){
        if( e.code!='EEXIST' ){
          throw e
        }
      }
    }else{
      const copy = fs.readFileSync(copyFrom)
      fs.writeFileSync(copyTo, copy)
    }
  }

  return this
}

PathSync.prototype.getArray = function(options){
  options = options || {}
  /*
  var opsNum = Path.castReadOps(options)
    ,filter = Path.getFilterByReadOps(options)
  */

  options.recursive = options.recursive==null ? false : options.recursive
  options.shortName = options.shortName==null ? 'relative' : options.shortName
  //options.combine = options.combine==null ? true : options.combine
  options.sync = true

  return nodeDir.files(this.path, 'combine', null, options)
  //return readDir.readSync(this.path, filter, opsNum)
}

PathSync.prototype.getRecurArray = function(options){
  options = options || {}
  options.recursive = true
  options.sync = true
  options.shortName = 'relative'
  return nodeDir.files(this.path, 'combine', null, options)
}

PathSync.prototype.getRecurPathReport = function(options){
  options = options || {}
  options.recursive = true
  options.sync = true
  return nodeDir.files(this.path, 'all', null, options)
}

/** file/path looper.

  - Based on options, you can recursively read directories and/or files. returns promise
  - Runs using npm package readdir. See npm readdir for more usage instructions.

  @eachCall:function(String:path, Number:index)
  @options: {
      NON_RECURSIVE:true,
      INCLUDE_DIRECTORIES:true,
      filter:['** / **.js','** / **.jade']//!remove spaces from example!
    }

*/
PathSync.prototype.each = function(eachCall, options){
  var looping;
  var resultArray = this.getArray(options)
  for(let resX=0; resX < resultArray.length; ++resX){
    var v = resultArray[resX]
    if(looping!==false){
      looping = eachCall.call(this,v,resX)
    }
  }

  return this
}

/** builds array of results
  @eachCall:function(String:path, Number:index)
*/
PathSync.prototype.map = function(eachCall, options){
  var looping = [];
  var resultArray = this.getArray(options)

  for(let resX=0; resX < resultArray.length; ++resX){
    var v = resultArray[resX]
    if(looping!==false){
      looping.push( eachCall.call(this,v,resX) )
    }
  }

  return looping
}

PathSync.prototype.recur = function(eachCall, options){
  options = options ? options : {}
  options.recursive = true
  return this.each(eachCall, options)
}

/** builds array of results. See .map function
  @eachCall:function(String:path, Number:index)
*/
PathSync.prototype.recurMap = function(eachCall, options){
  options = options ? options : {}
  options.recursive = true
  return this.map(eachCall, options)
}












var PathString = function PathString(Path){
  this.Path = Path
  return this
}

PathString.prototype.getLastName = function(){
  return Path.getName(this.Path.path)
}
PathString.prototype.getName = PathString.prototype.getLastName

PathString.prototype.removeFile = function(){
  return this.Path.path.replace(/[^/\\]+\.[^.\/]+$/,'')
}

PathString.prototype.removeExt = function(){
  return this.Path.path.replace(/\.[^.\/]+$/,'')
}

PathString.prototype.ext = function(ext){
  ext = ext.replace(/^\./,'')
  var newPath = this.removeExt()
  newPath = Path.noLastSlash(newPath) + '.' + ext
  return newPath
}

PathString.prototype.noLastSlash = function(){
  return Path.noLastSlash(this.Path.path)
}

PathString.prototype.noFirstSlash = function(){
  return this.Path.path.replace(/^(\/|\\)/,'')
}

PathString.prototype.join = function(){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(this.Path.path)
  //all args to string as Nodes path will fail on path.join(somePath,2016)
  for(var i=args.length-1; i >= 0; --i){
    args[i]=String(args[i])
  }
  return path.join.apply(path,args)
}















var NewPath = function NewPath(Path){
  this.Path = Path
  return this
}

NewPath.prototype.noFirstSlash = function(){
  return new Path(this.Path.string.noFirstSlash())
}

NewPath.prototype.noLastSlash = function(){
  return new Path(this.Path.string.noLastSlash())
}

NewPath.prototype.join = function(){
  var args = Array.prototype.slice.call(arguments)
  args.unshift(this.Path.path)
  var p = path.join.apply(path, args)
  return new Path(p)
}

NewPath.prototype.ext = function(ext){
  return new Path(this.Path.string.ext(ext))
}

NewPath.prototype.searchUp = function(){
  return new SearchUpPath(new Path(this.Path.path))
}







function SearchUpPath(Path){
  this.Path = Path
  return this
}

SearchUpPath.prototype.setExt = function(ext){
  this.ext = ext.replace(/^(.+)?\./,'');return this;
}

SearchUpPath.prototype.getExt = function(){
  return this.ext
}


SearchUpPath.prototype.setIndexFileName = function(v){
  if(v.search(/([^\/\\]+)?\.[^.]+$/) > 1){
    this.setExt(v)
  }
  this.indexFileName = v.replace(/^(.+)?(\\|\/)/,'').replace(/\.([^.]+)?/,'')//replace(no opening slashes) . replace(any extension)
  return this
}

SearchUpPath.prototype.getIndexFileName = function(v){
  return this.indexFileName
}

/*
SearchUpPath.prototype.setSuccess = function(v){
  this.onSuccess = v;return this;
}
SearchUpPath.prototype.success = SearchUpPath.prototype.setSuccess

SearchUpPath.prototype.getSuccess = function(){
  return this.onSuccess
}
*/

SearchUpPath.prototype.setRollUpWith = function(v){
  this.rollupWith = v;return this;
}
SearchUpPath.prototype.rollUpWith = SearchUpPath.prototype.setRollUpWith

SearchUpPath.prototype.getRollUpWith = function(){
  return this.rollupWith
}

/*
SearchUpPath.prototype.setFail = function(v){
  this.onFail = v;return this;
}
SearchUpPath.prototype.fail = SearchUpPath.prototype.setFail

SearchUpPath.prototype.getFail = function(){
  return this.onFail
}
*/

SearchUpPath.prototype.go = function(){
  //var success = this.getSuccess()
  var roll = this.getRollUpWith()
    ,Path = this.Path
    //,fail = this.getFail()
    ,ext = this.getExt()
    ,ifn = this.getIndexFileName()+'.'+ext

  var resultStatus = {isFirstFind:true, isIndex:false}

  return ack.promise()
  .callback(function(callback){
    var nextProcessor = function(Path, next){
      var isFile = Path.isFile() || Path.noLastSlash().isFile()
      if(isFile){
        Path.ifExists(function(){
          callback(null, Path.path, resultStatus)
          //success(Path.path)//deprecated in favor of promises
        },function(p){
          if(roll){
            roll.up()//rollup path
          }
          next()
        })
      }else{
        //could not be found logic
        var failUp = function(p){
          var isRollLeft = roll==null || roll.getDepth()>=1

          if(roll){
            roll.up()
          }

          if(isRollLeft){
            next()
          }else{
            callback(null, null, resultStatus)//could not be found
            //fail()
          }
        }
        
        var testExt = function(){
          var isRollLeft = roll==null || roll.getDepth()>=1

          if(isRollLeft){
            Path.ext(ext)//maybe what is a directory is a jade file
            if(roll){
              roll.ext(ext)//maybe what is a directory is a jade file
            }

            Path.ifExists(function(){
              callback(null, Path.path, resultStatus)
              //success(Path.path)
            },failUp)
          }else{
            callback(null, null, resultStatus)//could not be found
            //fail()
          }
        }

        if(ifn){//maybe directory with index file with-in?
          if(roll){
            roll.join(ifn)
          }

          Path.join(ifn).ifExists(function(){
            resultStatus.isIndex = true
            callback(null, Path.path, resultStatus)
            //success(Path.path)
          },function(){
            resultStatus.isFirstFind = false//we have to seach elsewhere so it is not the first find

              Path.up()//remove index (do not do to relPath.up because relPath.upNext takes care of it)
            if(roll){
              roll.up()//remove index (do not do to relPath.up because relPath.upNext takes care of it)
            }

            if(ext){
              testExt()
            }
          })
        }else if(ext){
          testExt()
        }
      }
    }

    return Path.upNext(nextProcessor)
  })
}

module.exports = function(path){return new Path(path)}