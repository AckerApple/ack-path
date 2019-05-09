"use strict";
var ack = require('../../weave.js'),
	path = require('path'),
	assert = require('assert')

describe('ack.file',function(){
	var	OneRequire,tenFilePath,TenFile,TenFileSync,ReturnOneFile,rtnOneFilePath,FileNotFound

	beforeEach(function(){
		tenFilePath = path.join(__dirname,'test','10CharFile.txt')
		rtnOneFilePath = path.join(__dirname,'../','assets/returnOne.js')
		ReturnOneFile = ack.file(rtnOneFilePath)
		FileNotFound = ack.file(rtnOneFilePath+'s')
		TenFile = ack.file(tenFilePath)
		OneRequire = ack.file(tenFilePath)
		TenFileSync = ack.file(tenFilePath).sync()
	})

	it('#copyTo',function(){
		var p2 = ack.file(__dirname).join('test2.js')
		var p = ack.file(__dirname).join('test.js')
		
		return p.copyTo( p2 )
		.then(()=>{
			const NewFile = ack.path(p2).File().sync()
			assert.equal(NewFile.exists(), true)

			NewFile.delete()
			assert.equal(NewFile.exists(), false)
		})
	})

	it('#moveTo',function(){
		var p3 = ack.file(__dirname).join('test3.js')
		var p2 = ack.file(__dirname).join('test2.js')
		var p = ack.file(__dirname).join('test.js')
		
		return p.copyTo( p2 )
		.then(()=>p2.moveTo(p3))
		.then(()=>{
			const NewFile2 = ack.path(p2).File().sync()
			assert.equal(NewFile2.exists(), false, "NewFile2 deleted")

			const NewFile3 = ack.path(p3).File().sync()
			assert.equal(NewFile3.exists(), true, "NewFile3 exists")

			NewFile3.delete()
			assert.equal(NewFile3.exists(), false, "NewFile3 deleted")
		})
	})

	it('#removeExt',function(){
		var p = ack.file(__dirname).join('test.js').removeExt().path
		assert.equal(p, path.join(__dirname,'test'))
	})

	it('#join',function(){
		var F1 = ack.file(__dirname)
		F1.join('acker')
		assert.equal(F1.path, path.join(__dirname,'acker'))
	})

	it('#Join',function(){
		var F1 = ack.file(__dirname)
		var F2 = F1.Join('acker')
		assert.equal(F2.path, path.join(F1.path,'acker'))
	})

	describe('#sync',function(){
		it('#readJson',function(){
			var jsonPath = path.join(__dirname,'../../package.json')
			var result = ack.file(jsonPath).sync().readJson()
			assert.equal(result.name, 'ack-path')
		})

		it('#read',function(){
			var jsonPath = path.join(__dirname,'../../package.json')
			var result = ack.file(jsonPath).sync().read()
			assert.equal(JSON.parse(result.toString()).name, 'ack-path')
		})

		it('#readAsString',function(){
			var jsonPath = path.join(__dirname,'../../package.json')
			var result = ack.file(jsonPath).sync().read()
			assert.equal(JSON.parse(result).name, 'ack-path')
		})
	})

	it('#paramDir',function(done){
		TenFile.paramDir()
		.then(()=>TenFile.write(1234567890))
		.then(()=>TenFile.exists())
		.then(res=>{		
			if( !res ){
				throw new Error('Ten File Did Not get created')
			}

			return TenFile.read()
		})
		.then(function(read){
			if(read.length!=10){
				throw new Error('expected written file length 10. Got '+read.length)
			}
		})
		.then(()=>TenFile.delete())
		.then(done).catch(done)
	})

	it('#getJson',function(done){
		var jsonPath = path.join(__dirname,'../../package.json')
		ack.file(jsonPath).getJson()
		.then(function(result){
			assert.equal(result.name, 'ack-path')
		})
		.then(done).catch(done)
	})

	it('#append',function(done){
		TenFile.append('abcdefghij').then(function(){
			assert.equal(TenFileSync.exists(),true,'file write/exists')

			var read = TenFileSync.read()

			assert.equal(read.length,10,'expected file length 10. Got '+read.length+' '+read)
		})
		.then(done).catch(done)
	})

	it('#write',function(done){
		TenFile.write(1234567890).then(function(){
			assert.equal(TenFileSync.exists(),true,'file write/exists')
			assert.equal(TenFileSync.read().length,10,'file length 10')
		})
		.then(done).catch(done)
	})

	it('#delete',function(done){
		TenFile.delete().then(function(){
			assert.notEqual(TenFileSync.exists(),true)
		})
		.then(done).catch(done)
	})

	it('#write#delete',function(done){
		TenFile.write('1234567890')
		.then(()=>TenFile.delete())
		.then(function(){
			assert.equal(TenFileSync.exists(),false,'path was not succesfully deleted')
		})
		.then(done).catch(done)
	})

	it('#requireIfExists',function(done){
		ReturnOneFile.requireIfExists()
		.then(function(result){
			if(result!=1)throw new Error('require result not equal 1');
		})
		.then(done).catch(done)
	})

	it('#requireIfExists-!exist',function(done){
		FileNotFound
		.requireIfExists()
		.then(function(result){
			if(result)throw 'not supposed to be called';
		})
		.then(done)
		.catch(done)
	})

	it('deleteTenFileDir',function(done){
		TenFile.Path().delete().then(done).catch(done)
	})

	it('#getMimeType',function(){
		var mimeType = ReturnOneFile.getMimeType()
		assert.equal(mimeType, 'application/javascript')
	})

	it('#stat',function(done){
		ReturnOneFile.stat().then(function(stats){
			assert.equal(stats.size!=null,true)
		})
		.then(done).catch(done)
	})
})