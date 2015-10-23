# Angular service for encoding/decoding regular strings and blobs into base64 strings 

The service is a pack of bits and pieces of code found mainly at stackoverflow, to handle base64 encoding and decoding.
It supports both strings and blobs and return promises.

## Dependencies

AngularJs should be installed.

	bower install angular --save

## Install

```
bower install ng-base64 --save
```
   
## Getting Started

After installing it, make sure to inject it as a dependency in the angular app.

```javascript
	var app = angular.module('myApp', ['ng-base64']);
```

Than use it in an angular service or controller:

```javascript
	var MySvc = function(Base64) {
	}
	angular.module('myApp').factory('MySvc',['Base64',MySvc]);
```

Than the service can be used:

## Real life examples

### Encoding from a strings
```
			var getToken = function () {
				return Base64.encodeStr('userName:password').then(function (encoded) {
					var data = {
							'grant_type': 'client_credentials'
						},
						reqOptions = {
							headers: {
								'Authorization': 'Basic ' + encoded,
							}
						};

					return apiRequest('post', data, '/token', reqOptions);
				});
			},
```

### Encoding from a blob
```
	var dummy = function () {
		// NOTE!! constructing Blob like that may not work for your browser.
		// It will work with newest browsers
		var blob = new Blob(['<div><h1>hey!</h1></div>'], {
			type: 'text/html'
		});
		Base64.encodeBlob(blob).then(function(encoded) {
			/* Do sth */
		},function(err) {
			/* Fail correctly */
		});
	}
```

### Decoding into a blob
There was a case when I recieved a base64 encoded audio file from the server. This is how I played it: 

```
	var playBlob = function(audioBlob,audioId) {
		if(audioBlob instanceof Blob) {
			// console.log("Play the record");
			var url = (window.URL || window.webkitURL).createObjectURL(audioBlob);
			if(player) {
				player.pause();
			} else {
				player = new window.Audio();
			}
			player.src = url;
			player.play();
			player.onended = function(e) {
				$scope.$emit('audioRecordFinished',audioId);
			};
		} else {
			console.log('Error: Wrong audio data type');
		}
	};

	var playBase64 = function(base64Str,audioId) {
		return Base64.decodeBlob(base64Str).then(function(audioBlob) {
			playBlob(audioBlob,audioId);
		}, function(err) {
			// throw err or sth
		})
	};
```

