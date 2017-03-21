# ack-path
Operating system directory functionality

### Table of Contents
- [Directory Functionality](#directory-functionality)
  - [require](#require)
  - [join()](#join)
  - [param()](#param)
  - [paramDir()](#paramdir)
  - [copyTo()](#copyto)
  - [moveTo()](#moveto)
  - [rename()](#rename)
  - [delete()](#delete)
  - [each()](#each)
  - [eachFilePath()](#eachfilepath)
  - [recur()](#recur)
  - [recurFiles()](#recurfiles)
  - [String Manipulations](#string-manipulations)
  - [isDirectory](#isdirectory)
  - [isFile](#isfile)
  - [isLikeFile](#islikefile)
- [Directory Sync Examples](#directory-sync-examples)
  - [require](#syncrequire)
  - [dirExists()](#syncdirexists)
  - [exists()](#syncexists)
  - [delete()](#syncdelete)
  - [copyTo()](#synccopyTo)
- [File Functionality](#file-functionality)
  - [require](#requirefile)
  - [delete()](#file.delete)
  - [getMimeType()](#filegetmimetype)
  - [stat()](#filestat)
  - [write()](#filewrite)
  - [append()](#fileappend)
  - [readJson()](#filereadjson)


## Directory Functionality

### require
```
var Path = require('ack-path')(__dirname)
var stringPath = Path.path
```

### .join()
write file promise
```
Path.join('file-name.js').writeFile(string).then().catch()
```

### .param()
Create directory if not existant. Does not take into condsideration if path is actually a file (file path will be created as a folder)
```
Path.param().then()
```

### .paramDir()
Create directory if not existant. Takes condsideration if path is actually a file and only creates folder pathing
```
Path.paramDir().then()
```

### .copyTo()
```
Path.copyTo(__dirname+'-copy').then()
```

### .moveTo()
move entire directory or single file
```
Path.moveTo(__dirname+'-moved').then()
```

### .rename()
in-place rename directory or single file
```
Path.rename('new-item-name').then()
```

### .delete()
path delete promise
```
Path.delete().then()
```

### .each()
file and folder looper

- Based on options, you can recursively read directories and/or files. returns promise
- Runs using npm package readdir. See npm readdir for more usage instructions.
- Arguments
  - eachCall function(String:path, Number:index)
  - options
    - recursive : true
    - INCLUDE_DIRECTORIES : true
    - INCLUDE_HIDDEN : true
    - filter : ['**/**.js','**/**.jade']
    - excludeByName : name=>yesNo
```
Path.each( itemStringPath=>itemStringPath ).then( itemPathArray=>console.log(itemPathArray) )
```


### .eachFilePath()
Loop folder to fire callback for each file found. Only produces file results. see eachPath function
```
Path.eachFilePath( fileStringPath=>fileStringPath ).then( filePathArray=>console.log(filePathArray) )
```

### recur
Recursively loop folder to fire callback for each item found. See eachPath function
```
Path.recur( ItemPath=>ItemPath.path ).then( pathStringArray=>console.log(pathStringArray) )
```

### .recurFiles()
Recursively loop folder to fire callback for each file found. See eachPath function
```
Path.recurFiles( filePath=>console.log('file', filePath) )
```

### String Manipulations
```
var PathTest = require('ack-path')('/test/file.js')

PathTest.removeExt().path == "/test/file"
PathTest.removeFile().path == "/test/"
```

### isDirectory
hard-checks file system if item is a folder
```
require('ack-path')('/test/file.js').isDirectory().then(res=>res==false)
```

### isFile
hard-checks file system if item is a file
```
require('ack-path')('/test/file.js').isFile().then(res=>res==true)
```

### isLikeFile
Checks string for a file extension
```
require('ack-path')('/test/file.js').isLikeFile() == true
```

## SYNC Examples

### .sync().require
```
var PathSync = require('ack-path')(__dirname).sync()
var pathTo = PathSync.path
```

### .sync().dirExists()
considers if path is actually a file
```
PathSync.dirExists()
```

### .sync().exists()
```
PathSync.exists()
```

### .sync().delete()
```
PathSync.delete()
```

### .sync().copyTo()
```
PathSync.copyTo()
```

## File Functionality
A more file specific set of objective functionality

### require.file
```
var File = require('ack-path')(__dirname).file('file-name.js')
var filePath = File.path
```

### .file().delete()
```
File.delete().then()
```

### .file().getMimeType()
```
File.getMimeType()//Ex: application/javascript
```

### .file().stat()
```
File.stat().then(stats=>stats.size)
```

### .file().write()
```
File.write(string).then()
```

### .file().append()
```
File.append(string).then()
```

### .file().readJson()
```
File.readJson().then()
```
