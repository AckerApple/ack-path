var assert = require('assert')
	,path = require('path')
	,ack = require('../../weave')

describe('ack.path.sync()',function(){
	var tarDir,assestsPath,mockPath,mockPathArray,mockPathNameArray
		,configPaths = function(){
			tarDir = path.join(__dirname,'../../')
			assestsPath = path.join(__dirname,'../assets')+path.sep
			mockPath = assestsPath+'MockFolder'
			mockPathArray = [
				'SomeFile.js',
				'SomeFolder'+path.sep,
				'SomeFolder'+path.sep+'SomeFolderFile.js'
			]
			mockPathNameArray = ['SomeFile.js','SomeFolder','SomeFolderFile.js']
		}

	beforeEach(configPaths)

	it('#getSubDirNameArray',()=>{
		const res = ack.path(mockPath).sync().getSubDirNameArray()
		assert.equal(typeof res, 'object')
		assert.equal(res.constructor, Array)
		assert.equal(res.length, 1)
		assert.equal(res[0], 'SomeFolder')
	})

	it('#map',function(){
		var mapped = ack.path(assestsPath).sync().map(function(v,i){
			return v
		})

		mapped = mapped.filter(item=>item.search(/\.DS_Store/)<0)
		assert.equal(typeof mapped, 'object')
		assert.equal(mapped.constructor, Array)
		assert.equal(mapped.length, 6)
	})

	it('#getArray',function(){
		var mapped = ack.path(assestsPath).sync().getArray({recursive:true})
		assert.equal(mapped.length, 17)
	})

	it('#recurMap',function(){
		var mapped = ack.path(assestsPath).sync().recurMap(function(v,i){
			return v
		})

		mapped = mapped.filter(item=>item.search(/\.DS_Store/)<0)
		assert.equal(mapped.length, 15)
	})

	it('#copyTo',function(){
		const copyTo = path.join(assestsPath,'../','assets2')

		ack.path(assestsPath).sync().copyTo( copyTo )
		
		const NewPathSync = ack.path(copyTo).sync()
		assert.equal(NewPathSync.exists(), true)

		NewPathSync.delete()
		assert.equal(NewPathSync.exists(), false)
	})

	it('#getRecurArray',()=>{
		const array = ack.path(assestsPath).sync().getRecurArray()
		assert.equal(array.constructor, Array)
	})
})