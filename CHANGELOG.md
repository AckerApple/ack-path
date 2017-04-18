# ack-path - Change Log
All notable changes to this project will be documented here.

## [1.5.9] - 2017-04-18
### Added
- cli copy command

## [1.5.8] - 2017-03-22
### Added
- init ack-path checks constructor of ack-path when performing ackPath( AckPath ) instead of required ackPath( AckPath.path )
- alias getLastName for getName
- ack-p file reference of ack-path/ack-p.js

## [1.5.6] - 2017-03-21
### Improved
- rename
### Added
- moveTo
- File().param(output)

## [1.5.2] - 2017-03-17
- docs and better names. old names still supported

## [1.5.0] - 2017-03-02
### Breaking Change
- discovered recurFilePath and eachFilePath were not respecting to return files only
- In general, any functionality that only searched for files or only folders was working incorrectly
- Removed Path.new - use Path.Join() with no arguments
- Removed Path.string - user Path.String()

## [1.4.0] - 2017-02-08
### Breaking Change
- .getArray() and .getRecurArray() both were not returning an actual array, now they do
### Added
- Added .copyTo()
### Fixed
- sync().copyTo()

## [1.3.5] - 2016-12-12
### Fixed
- Added to deprecated filter array REGX conversion for better accuracy to old deprecated method

## [1.3.4] - 2016-12-08
### Fixed
- Restored support for deprecated ackPath.each({filter:[String]})
- Restored a slash that appeared at the end
- Restored the way readdir fed combined recursive results

## [1.3.2] - 2016-12-07
### Added
- rename function

## [1.3.1] - 2016-12-01
### Fixed
- when using path.param(), the promise binding was incorrect

## [1.3.0] - 2016-12-01
### Breaking Changes
- replace [readdir](https://www.npmjs.com/package/readdir) with forked version of [node-dir](https://github.com/AckerApple/node-dir)

## [1.2.1] - 2016-11-29
### Change
- writeFile no longer promises the ack-path object. Instead null is passed

## [1.2.0] - 2016-11-23
No breaking changes but significant enough worth a minor version bump
### Added
- destinction between methods that check if path is actually a file or not


## [1.1.0] - 2016-10-18
### Breaking Change
- .isFile() is now isLikeFile()
- .isFile() is now async operation to actually verify if file or not
### Added
- sync().copyTo()
- sync().delete()

## [1.0.0] - 2016-07-31
### Added
- Path.writeFile(content)

## [1.0.0] - 2016-07-19
### Created
