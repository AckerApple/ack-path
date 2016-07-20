# ack-path
Operating system directory functionality

## System Directory Functionality
```
var path = require('ack-path')

//created directory if not existant
path(__dirname).paramDir().then()

//string manipulation
path(__dirname).join('a','b','c.js').path// = __dirname/a/b/c.js

//string manipulation
path('/test/file.js').removeExt().path// = /test/file

//string manipulation
path('/test/file').removeExt().path// = /test/file

//string manipulation
path('/test/file.js').removeFile().path// = /test/

//string manipulation
path('/test/').removeFile().path// = /test/

//path delete promise
path(__dirname).delete().then()

path(__dirname).sync().exists()//NONASYNC
```

## System File Functionality
```
var path = require('ack-path')

path(__dirname).file('file-name.js').delete().then()
path(__dirname).file('file-name.js').getMimeType()//Ex: application/javascript
path(__dirname).file('file-name.js').stat().then(stats=>stats.size)
path(__dirname).file('file-name.js').write(string).then()
path(__dirname).file('file-name.js').append(string).then()
```
