Robust operating system directory functionality

[![hire me](https://ackerapple.github.io/resume/assets/images/hire-me-badge.svg)](https://ackerapple.github.io/resume/)
[![npm downloads](https://img.shields.io/npm/dm/ack-path.svg)](https://npmjs.org/ack-path)
[![Dependency Status](https://david-dm.org/ackerapple/ack-path.svg)](https://david-dm.org/ackerapple/ack-path)
[![Build Status](https://secure.travis-ci.org/AckerApple/ack-path.svg)](http://travis-ci.org/AckerApple/ack-path)
[![Build status](https://ci.appveyor.com/api/projects/status/el8bejrmk83nco60?svg=true)](https://ci.appveyor.com/project/AckerApple/ack-path)
[![NPM version](https://img.shields.io/npm/v/ack-path.svg?style=flat-square)](https://www.npmjs.com/package/ack-path)

<details>
  <summary><strong>Table of Contents</strong></summary>

- [Install](#install)
- [import](#import)
- [CLI Commands](#cli-commands)
  - [How to Use](#how-to-use)
  - [copy](#copy)
  - [move](#move)
- [Directory Functionality](#directory-functionality)
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
  - [moveTo()](#syncmoveTo)
- [File Functionality](#file-functionality)
  - [copyTo()](#filecopyto)
  - [moveTo()](#filemoveto)
  - [delete()](#filedelete)
  - [param()](#param)
  - [getMimeType()](#filegetmimetype)
  - [stat()](#filestat)
  - [write()](#filewrite)
  - [append()](#fileappend)
  - [readJson()](#filereadjson)

</details>

### Install
```
npm install ack-path
```
### Import
How to import this package
```javascript
var Path = require('ack-path')(__dirname)

console.log( Path.path === __dirname )//true test

//Now, you can do a whole lot more! Continue reading...
```

## CLI Commands
Timesaver script commands

### How to Use
Using the most basic command as an example, you can invoke the copy command, using any of the following methods:

package.json script example
```javascript
"scripts":{
  "copy": "ack-path copy ./relativeFrom ./relativeTo"
}
```

from command terminal example
```sh
./node_modules/bin/ack-path copy ./relativeFrom ./relativeTo
```

### Copy

```sh
ack-path copy ./relativeFrom ./relativeTo
```

### Move

```sh
ack-path move ./relativeFrom ./relativeTo
```

### Delete

```sh
ack-path delete ./relativePath
```


## Directory Functionality

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

Returns promise with context of this Path

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

### .sync().moveTo()
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

### .file().copyTo()
```javascript
File.copyTo(__filename+'.copy').then()
```

### .file().moveTo()
```javascript
File.moveTo(__filename+'.newname').then()
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
