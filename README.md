# ack-path
Operating system directory functionality

### Table of Contents
- [Directory Functionality](#directory-functionality)
  - [require](#require)
  - [join()](#join)
  - [param()](#param)
  - [paramDir()](#paramdir)
  - [copyTo()](#copyto)
  - [delete()](#delete)
  - [String Manipulations](#string-manipulations)
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

### .delete()
path delete promise
```
Path.delete().then()
```

### String Manipulations
```
var PathTest = require('ack-path')('/test/file.js')

PathTest.removeExt().path == "/test/file"
PathTest.removeFile().path == "/test/"
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
