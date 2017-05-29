# 写真の撮影

## 写真の撮影

|操作|Endpoint|メソッド|
|:--|:--|:--|
|写真の撮影| http://IP:4035/gotapi/mediastreamRecording/takePhoto?serviceId=###################### | POST |

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
function takePhoto() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/takePhoto?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
    dConnect.post(uri , null, null, function(json) {
        if (json.result == 0) {
            var uri = json.uri
            imageElement.src = uri;
            console.log(uri);
        } else {
            console.log(json.result);
        }

    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
```
