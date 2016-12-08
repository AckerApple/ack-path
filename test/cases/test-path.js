var assert = require('assert')
	,path = require('path')
	,ack = require('../../weave')

describe('ack.path',function(){
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

	it('#join',()=>{
		assert.equal(ack.path('1').join('2','3').path, path.join('1','2','3'))
	})

	it('#Join',()=>{
		assert.equal(ack.path('1').Join('2','3').path, path.join('1','2','3'))
	})

	it('#removeExt',function(){
		assert.equal(ack.path('/test/file.js').removeExt().path, '/test/file')
		assert.equal(ack.path('/test/file').removeExt().path, '/test/file')
	})

	it('#removeFile',function(){
		assert.equal(ack.path('/test/file.js').removeFile().path, '/test/')
		assert.equal(ack.path('/test/').removeFile().path, '/test/')
	})

	describe('#each',function(){
		it('path-array-compare',done=>{
			const x=0

			var nameArray = []			
			ack.path(mockPath)
			.each(function(name,i){
				nameArray.push(name)
			},{NON_RECURSIVE:false, excludeByName:name=>name.toUpperCase()=='.DS_STORE'})
			.then( ()=>assert.deepEqual(nameArray.sort(), mockPathArray.sort()) )
			.then(done).catch(done)
		})

		it('break-test',function(done){
			var repeater = function(name,i){
				assert.equal(i,0)//the return false below should prevent loop from continuing
				return false
			}
			//should only loop once
			ack.path(mockPath).each(repeater,{NON_RECURSIVE:false},function(){done()}).catch(done)
		})
	})

	//Node path.join only allows string, this test would fail if numbers not casted to string
	it('numbers-to-string',function(){
		ack.path(mockPath).join(22)
	})

	it('#upEach',function(){
		ack.path(__dirname)
		.upEach(function(Path){
			assert.equal(typeof(Path),'object')
			assert.equal(typeof(Path.path),'string')
		})
	})

	it('#eachPath',function(done){
		var ops = {NON_RECURSIVE:false, excludeByName:name=>name.toUpperCase()=='.DS_STORE'}
		const names = []
		var repeater = function(Path,i){
			names.push(Path.getName())
			//assert.equal(Path.getName(), mockPathNameArray[i],'Path.name check, expected '+Path.getName()+' but '+i+' got '+mockPathNameArray[i])
		}

		ack.path(mockPath)
		.eachPath(repeater,ops)
		.then(()=>{
			assert.deepEqual(mockPathNameArray.sort(), names.sort())
		})
		.then(done).catch(done)
	})

	it('#getSubDirNameArray',done=>{
		ack.path(mockPath).getSubDirNameArray()
		.then(res=>{
			assert.equal(res.length, 1)
			assert.equal(res[0], 'SomeFolder')
		})
		.then(done).catch(done)
	})

	it('#getSubDirArray',done=>{
		ack.path(mockPath).getSubDirArray()
		.then(res=>{
			assert.equal(res.length, 1)
			assert.equal(res[0].getName(), 'SomeFolder')
		})
		.then(done).catch(done)
	})

	it('#nextSubDir',function(done){
		var ackFound = false
		ack.path(tarDir).Join('../')
		.nextSubDir(function(Path,i,next){
			assert.equal(Path.sync().exists(),true)
			if(Path.sync().exists('index.js')){
				ackFound=true
			}
			next()
		})
		.then(function(dirNameArray){
			assert.equal(ackFound,true)
		})
		.then(done).catch(done)
	})

	it('#eachSubDirName',function(done){
		var ackFound = false
		ack.path(tarDir)
		.new.join('../').eachSubDir(function(Path,i){
			assert.equal(Path.sync().exists(),true)
			if(Path.sync().exists('index.js')){
				ackFound=true
			}
		},function(dirNameArray){
			try{
				assert.equal(ackFound,true)
				done()
			}catch(e){done(e)}
		})
	})

	it('#ifExists',function(done){
		ack.path(assestsPath)
		.ifExists('MockFolder',function(){
			done()
		},function(){
			throw 'MockFolder does not exist'
		})
	})

	it('#require',function(done){
		ack.path(assestsPath)
		.require('PathRequireTest.js')
		.then(function(r){
			assert.equal(r.success,true,'PathRequireTest.js was required')
		})
		.then(done)
		.catch(done)
	})

	describe('actual-hard-disc',()=>{
		afterEach(done=>{
			var Path = ack.path(assestsPath).join('paramPathTest0')
			
			Path.param().bind(Path)
			.then( Path.delete )
			.then(function(){
				assert.equal(Path.sync().exists(),false,'test path was not succesfully deleted')
			})
			.then(done).catch(done)
		})

		describe('#param',()=>{
			it('target-folder',function(done){
				var Path = ack.path(assestsPath).join('paramPathTest0','paramPathTest1','paramPathTest2')
				Path.param()
				.then(function(){
					assert.equal(Path.sync().exists(),true,'path was not succesfully created')
				})
				.then(done).catch(done)
			})

			it('target-file-folder',function(done){
				var Path = ack.path(assestsPath).join('paramPathTest0','paramPathTest1','paramPathTest2','acker.js')
				Path.param()
				.then(function(){
					assert.equal(Path.sync().exists(),true,'path was not succesfully created')
				})
				.then(()=>Path.delete())
				.then(done).catch(done)
			})
		})

		describe('#paramDir',()=>{
			it('target-folder',function(done){
				var Path = ack.path(assestsPath).join('paramPathTest0','paramPathTest1','paramPathTest2')
				
				Path.paramDir().bind(Path)
				.then(function(){
					assert.equal(Path.sync().dirExists(),true,'path was not succesfully created')
					assert.equal(Path.sync().exists(),true)
				})
				.then( Path.deleteDir )
				.then(done).catch(done)
			})

			it('target-file-folder',function(done){
				var Path = ack.path(assestsPath).join('paramPathTest0','paramPathTest1','paramPathTest2','acker.js')
				
				Path.paramDir().bind(Path)
				.then(function(){
					assert.equal(Path.sync().dirExists(),true,'path was not succesfully created')
					assert.equal(Path.sync().exists(),false,'file/folder was created when it should have not')
				})
				.then( Path.deleteDir )
				.then(done).catch(done)
			})
		})
	})

	it('#isDirectory',(done)=>
		ack.path(assestsPath)
		.isDirectory()
		.then(yesNo=>{
			assert.equal(yesNo,true)
		})
		.then(done).catch(done)
	)

	describe('#sync',function(){
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
	})
})