/*jshint expr: true*/ // This should allow 'expect.to.be.true' types of expressions
/*global inject,sinon,expect,it,describe,before,beforeEach,window,BlobBuilder */
'use strict';
describe('test base64 angular service', function () {
	var Base64, $rootScope, $q;

	beforeEach(function () {
		// load the module we want to test
		module('ng-base64');

		// inject the services we want to test
		inject(function (_Base64_, _$rootScope_, _$q_) {
			Base64 = _Base64_;
			$rootScope = _$rootScope_;
			$q = _$q_;
		});
	});
	describe('strings', function () {
		var str = 'ttttttt',
			base64Str = 'dHR0dHR0dA==';
		it('encode -> resolves with base64 formated string', function (done) {
			var successSpy = sinon.spy(function (res) {
					expect(res).to.be.a('string');
					expect(res).to.have.length.above(0);
					expect(res.length % 4).to.be.equal(0);
					expect(res).to.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/);
					done();
				}),
				rejectSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				});
			Base64.encodeStr(str).then(successSpy, rejectSpy);
			$rootScope.$apply();
		});
		it('decode -> resolves with regular string', function (done) {
			var successSpy = sinon.spy(function (res) {
					expect(res).to.be.a('string');
					expect(res).to.have.length.above(0);
					expect(res).to.be.string(str);
					done();
				}),
				rejectSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				});
			Base64.decodeStr(base64Str).then(successSpy, rejectSpy);
			$rootScope.$apply();
		});
		it('decode -> rejected invalid characters', function (done) {
			var successSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				}),
				rejectSpy = sinon.spy(function (err) {
					expect(err).to.be.a('string');
					done();
				});
			Base64.decodeStr('asd24aqdASFA!==').then(successSpy, rejectSpy);
			$rootScope.$apply();
		});
	});
	describe('blobs', function () {
		var blob, base64Blob = 'data:text/html;base64,PGRpdj48aDE+aGV5ITwvaDE+PC9kaXY+';
		before(function () {
			var mimeString = 'text/html',
				aFileParts = ['<div><h1>hey!</h1></div>'];

			try {
				blob = new Blob([aFileParts], {
					type: mimeString
				});
			} catch (e) {
				// TypeError old chrome and FF
				window.BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder ||
					window.MozBlobBuilder ||
					window.MSBlobBuilder;
				if (e.name === 'TypeError' && BlobBuilder) {
					var bb = new BlobBuilder();
					bb.append(aFileParts);
					blob = bb.getBlob(mimeString);
				} else if (e.name === 'InvalidStateError') {
					// InvalidStateError (tested on FF13 WinXP)
					blob = new Blob([aFileParts], {
						type: mimeString
					});
				} else {
					// We're screwed, blob constructor unsupported entirely
					blob = false;
				}
				expect(blob).to.be.not.false;
			}
		});
		it('encode using callback -> no error', function (done) {
			var successSpy = sinon.spy(function (err, res) {
				expect(err).to.be.null;
				expect(res).to.be.a('string');
				expect(res).to.have.length.above(0);
				expect(res.length % 4).to.be.equal(0);
				expect(res).to.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/);
				done();
			});
			Base64.encodeBlob(blob, successSpy);
		});
		it('encode using promise-> resolves with base64 formated blob', function (done) {
			var result,
				successSpy = sinon.spy(function (res) {
					result = res;
					expect(res).to.be.a('string');
					expect(res).to.have.length.above(0);
					expect(res.length % 4).to.be.equal(0);
					expect(res).to.match(/^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/);
					done();
				}),
				rejectSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				});
			Base64.encodeBlob(blob).then(successSpy, rejectSpy);
			// HACK: force the digest cycle to be called after all async callbacks and promises processed
			setTimeout(function () {
				$rootScope.$apply();
			});
		});
		it('dcode base64 with mimetype -> resolves to  blob', function (done) {
			var successSpy = sinon.spy(function (res) {
					expect(res).to.be.eql(blob);
					done();
				}),
				rejectSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				});
			Base64.decodeBlob(base64Blob).then(successSpy, rejectSpy);
			$rootScope.$apply();
		});
		it('dcode base64 without mimetype -> resolves to  blob', function (done) {
			var successSpy = sinon.spy(function (res) {
					expect(res.type).to.be.string('');
					expect(res.size).to.be.equal(blob.size);
					done();
				}),
				rejectSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				});
			Base64.decodeBlob(base64Blob.split(',')[1]).then(successSpy, rejectSpy);

			$rootScope.$apply();
		});
		it('dcode -> rejected empty input', function (done) {
			var successSpy = sinon.spy(function () {
					expect(false).to.be.true;
					done();
				}),
				rejectSpy = sinon.spy(function (err) {
					expect(err).to.be.a('string');
					expect(err).to.has.length.above(0);
					done();
				});
			Base64.decodeBlob().then(successSpy, rejectSpy);
			$rootScope.$apply();
		});
	});
});