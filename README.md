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

## Examples

```

```