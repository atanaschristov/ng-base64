/*global window,BlobBuilder*/
/*jshint bitwise: false*/
(function (angular) {
	'use strict';
	if (!angular) {
		console.log('angularjs is required');
		return;
	}

	var Base64 = function ($q) {
		// console.log('Base64');

		var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef' +
			'ghijklmnopqrstuvwxyz0123456789+/=';

		var self = {
			// Taken from http://ntt.cc/2008/01/19/base64-encoder-decoder-with-javascript.html
			encodeFromStr: function (string) {
				var deffered = $q.defer(),
					output = '',
					chr1, chr2, chr3 = '',
					enc1, enc2, enc3, enc4 = '',
					i = 0;

				do {
					chr1 = string.charCodeAt(i++);
					chr2 = string.charCodeAt(i++);
					chr3 = string.charCodeAt(i++);

					enc1 = chr1 >> 2;
					enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
					enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
					enc4 = chr3 & 63;
					console.log('chr1, chr2, chr3', chr1, chr2, chr3);

					if (isNaN(chr2)) {
						enc3 = enc4 = 64;
					} else if (isNaN(chr3)) {
						enc4 = 64;
					}
					console.log('enc1,enc2,enc3,enc4', enc1, enc2, enc3, enc4);
					output = output +
						keyStr.charAt(enc1) +
						keyStr.charAt(enc2) +
						keyStr.charAt(enc3) +
						keyStr.charAt(enc4);
					chr1 = chr2 = chr3 = '';
					enc1 = enc2 = enc3 = enc4 = '';
				} while (i < string.length);

				deffered.resolve(output);
				return deffered.promise;
			},
			// Taken from http://ntt.cc/2008/01/19/base64-encoder-decoder-with-javascript.html
			decodeStr: function (input) {
				var deffered = $q.defer(),
					output = '',
					chr1, chr2, chr3 = '',
					enc1, enc2, enc3, enc4 = '',
					i = 0;

				// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
				var base64test = /[^A-Za-z0-9\+\/\=]/g;
				if (base64test.exec(input)) {
					var err = 'There were invalid base64 characters in the input text.\n' +
						'Valid base64 characters are A-Z, a-z, 0-9, "+", "/",and "="\n' +
						'Expect errors in decoding.';
					// console.log(err);
					deffered.reject(err);
					return deffered.promise;
				}
				input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

				do {
					enc1 = keyStr.indexOf(input.charAt(i++));
					enc2 = keyStr.indexOf(input.charAt(i++));
					enc3 = keyStr.indexOf(input.charAt(i++));
					enc4 = keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output = output + String.fromCharCode(chr1);

					if (enc3 !== 64) {
						output = output + String.fromCharCode(chr2);
					}
					if (enc4 !== 64) {
						output = output + String.fromCharCode(chr3);
					}

					chr1 = chr2 = chr3 = '';
					enc1 = enc2 = enc3 = enc4 = '';

				} while (i < input.length);

				deffered.resolve(output);
				return deffered.promise;
			},
			// Taken from StackOverflow
			// 
			encodeFromBlobAsync: function (blob, callback) {
				var deffered = $q.defer(),
					reader = new FileReader();

				reader.onload = function () {
					var dataUrl = reader.result;
					var base64 = dataUrl.split(',')[1];
					if (typeof callback !== 'function') {
						deffered.resolve(base64);
					} else {
						callback(base64);
					}
				};
				reader.readAsDataURL(blob);

				if (typeof callback !== 'function') {
					return deffered.promise;
				}
			},
			// taken and modified from http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
			decodeBlob: function (input) {
				var deffered = $q.defer(),
					resultBlob;
				// convert base64 to raw binary data held in a string
				// doesn't handle URLEncoded bas64Data - see SO answer #6850276 for code that does this
				var byteString = atob(input.split(',')[1]);

				// separate out the mime component
				var mimeString = input.split(',')[0].split(':')[1].split(';')[0];
				// console.log(mimeString);

				// write the bytes of the string to an ArrayBuffer
				var ab = new ArrayBuffer(byteString.length);
				var ia = new Uint8Array(ab);
				for (var i = 0; i < byteString.length; i++) {
					// convert all characters to their numeric Unicode values
					ia[i] = byteString.charCodeAt(i);
				}

				try {
					resultBlob = new Blob([ab], {
						type: mimeString
					});
				} catch (e) {
					// TypeError old chrome and FF
					window.BlobBuilder = window.BlobBuilder ||
						window.WebKitBlobBuilder ||
						window.MozBlobBuilder ||
						window.MSBlobBuilder;
					if (e.name === 'TypeError' && window.BlobBuilder) {
						var bb = new BlobBuilder();
						bb.append(ab);
						resultBlob = bb.getBlob(mimeString);
					} else if (e.name === 'InvalidStateError') {
						// InvalidStateError (tested on FF13 WinXP)
						resultBlob = new Blob([ab], {
							type: mimeString
						});
					} else {
						// We're screwed, blob constructor unsupported entirely
						resultBlob = false;
						deffered.reject('Error: blob constructor is not supported');
					}
				}

				if (!resultBlob) {
					deffered.reject('Failed to decode');
				} else {
					deffered.resolve(resultBlob);
				}
				return deffered.promise;
			}
		};
		return self;
	};
	angular.module('ng-base64', []).service('Base64', ['$q', Base64]);
})(window.angular);