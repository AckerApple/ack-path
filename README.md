# ack-path
Operating system directory functionality

### Table of Contents
- [Commands](#commands)
  - [copy](#copy)
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
  - [getLastName](#getlastname)
- [Directory Sync Examples](#directory-sync-examples)
  - [require](#syncrequire)
  - [dirExists()](#syncdirexists)
  - [exists()](#syncexists)
  - [delete()](#syncdelete)
  - [copyTo()](#synccopyTo)
- [File Functionality](#file-functionality)
  - [require](#requirefile)
  - [delete()](#file.delete)
  - [param()](#param)
  - [getMimeType()](#filegetmimetype)
  - [stat()](#filestat)
  - [write()](#filewrite)
  - [append()](#fileappend)
  - [readJson()](#filereadjson)

## Commands
Timesaver script commands

### How to Use
Using the most basic command as an example, you can invoke the copy command, using any of the following methods:

relative command
```bash
./node_modules/bin/ack-path copy ./relativeFrom ./relativeTo
```

package.json script
```javascript
"scripts":{
  "copy": "ack-path copy ./relativeFrom ./relativeTo"
}
```

### Copy

```bash
ack-path copy ./relativeFrom ./relativeTo
```


## Directory Functionality

### require
```javascript
var Path = require('ack-path')(__dirname)
var stringPath = Path.path
```

### .join()
write file promise
```javascript
Path.join('file-name.js').writeFile(string).then().catch()
```

### .param()
Create directory if not existant. Does not take into condsideration if path is actually a file (file path will be created as a folder)
```javascript
Path.param().then()
```

### .paramDir()
Create directory if not existant. Takes condsideration if path is actually a file and only creates folder pathing
```javascript
Path.paramDir().then()
```

### .copyTo()
```javascript
Path.copyTo(__dirname+'-copy').then()
```

### .moveTo()
move entire directory or single file
```javascript
Path.moveTo( newPath:string, overwrite:boolean ).then()
```
```javascript
Path.moveTo(__dirname+'-moved').then()
```

### .rename()
in-place rename directory or single file
```javascript
Path.rename( newName:string, overwrite:boolean ).then()
```
```javascript
Path.rename('new-item-name', true).then()
```

### .delete()
path delete promise
```javascript
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
```javascript
Path.each( itemStringPath=>itemStringPath ).then( itemPathArray=>console.log(itemPathArray) )
```


### .eachFilePath()
Loop folder to fire callback for each file found. Only produces file results. see eachPath function
```javascript
Path.eachFilePath( fileStringPath=>fileStringPath ).then( filePathArray=>console.log(filePathArray) )
```

### recur
Recursively loop folder to fire callback for each item found. See eachPath function
```javascript
Path.recur( ItemPath=>ItemPath.path ).then( pathStringArray=>console.log(pathStringArray) )
```

### .recurFiles()
Recursively loop folder to fire callback for each file found. See eachPath function
```javascript
Path.recurFiles( filePath=>console.log('file', filePath) )
```

### String Manipulations
```javascript
var PathTest = require('ack-path')('/test/file.js')

PathTest.removeExt().path == "/test/file"
PathTest.removeFile().path == "/test/"
```

### isDirectory
hard-checks file system if item is a folder
```javascript
require('ack-path')('/test/file.js').isDirectory().then(res=>res==false)
```

### isFile
hard-checks file system if item is a file
```javascript
require('ack-path')('/test/file.js').isFile().then(res=>res==true)
```

### isLikeFile
Checks string for a file extension
```javascript
require('ack-path')('/test/file.js').isLikeFile() == true
```

### getLastName
Returns item after last slash
```javascript
require('ack-path')('/test/file.js').getLastName() == 'file.js'
require('ack-path')('/test/folder/').getLastName() == 'folder'
```

## SYNC Examples

### .sync().require
```javascript
var PathSync = require('ack-path')(__dirname).sync()
var pathTo = PathSync.path
```

### .sync().dirExists()
considers if path is actually a file
```javascript
PathSync.dirExists()
```

### .sync().exists()
```javascript
PathSync.exists()
```

### .sync().delete()
```javascript
PathSync.delete()
```

### .sync().copyTo()
```javascript
PathSync.copyTo()
```

## File Functionality
A more file specific set of objective functionality

### require.file
```javascript
var File = require('ack-path')(__dirname).file('file-name.js')
var filePath = File.path
```

### .file().delete()
```javascript
File.delete().then()
```

### .file().getMimeType()
```javascript
File.getMimeType()//Ex: application/javascript
```

### .file().stat()
```javascript
File.stat().then(stats=>stats.size)
```

### .file().write()
```javascript
File.write(string).then()
```

### .file().param()
just like write but if file already exists, no error will be thrown
```javascript
File.param(string).then()
```

### .file().append()
```javascript
File.append(string).then()
```

### .file().readJson()
```javascript
File.readJson().then()
```
