# ack-path
Operating system directory functionality

## System Directory Functionality
```
var path = require('ack-path')
var Path = path(__dirname)

//write file promise
Path.join('file-name.js').writeFile(string).then().catch()

//created directory if not existant
Path.paramDir().then()

//string manipulation
Path.join('a','b','c.js').path// = __dirname/a/b/c.js

//path delete promise
Path.delete().then()

var PathTest = path('/test/file.js')

//string manipulation
PathTest.removeExt().path == /test/file

//string manipulation
PathTest.removeExt().path == /test/file

//string manipulation
PathTest.removeFile().path == /test/

//string manipulation
PathTest.removeFile().path == /test/
```

## NONASYNC Examples
```
var PathSync = path(__dirname).sync()

PathSync.exists()

PathSync.delete()

PathSync.copyTo()
```

## System File Functionality
```
var path = require('ack-path')
var Path = path(__dirname).file('file-name.js')

Path.delete().then()
Path.getMimeType()//Ex: application/javascript
Path.stat().then(stats=>stats.size)
Path.write(string).then()
Path.append(string).then()
```
