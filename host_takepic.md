# 写真の撮影

## 写真の撮影

|操作|Endpoint|メソッド|
|:--|:--|:--|
|写真の撮影| http://IP:4035/gotapi/mediaStreaming/takePhoto?serviceId=##### | POST |

## TakePhoto

photo.html

```javascript
<html>
  <head>
	<title>takePhoto</title>
	<script src="js/dconnectsdk-2.0.0.js" type="text/javascript"></script>
	<script src="photo.js" type="text/javascript"></script>
  </head>
  <body>
    	<input type="button" value="写真を撮影" onclick="takePhoto();"/><br />
    	<img id="image" />
  </body>
</html>
```

photo.js

```javascript
var serviceId="#########"

function takePhoto() {
  var imageElement = document.getElementById("image");
  var builder = new dConnect.URIBuilder();
    builder.setProfile("mediastreamRecording");
    builder.setAttribute("takephoto");
    builder.setServiceId(serviceId);
    builder.setAccessToken(accessToken);

    var uri = builder.build();

    dConnect.post(uri, null, null, function(json) {
        if (json.result == 0) {
            imageElement.src = json.uri;
        } else {
        	alert(json.result);
        }

    }, function(errorCode, errorMessage) {
		alert(errorMessage);
    });
}

```
