# プレビュー

## プレビュー

|操作|Endpoint|メソッド|
|:--|:--|:--|
|プレビューの開始| http://IP:4035/gotapi/mediaStreaming/preview?serviceId=##### | PUT |
|プレビューの終了| http://IP:4035/gotapi/mediaStreaming/preview?serviceId=##### | DELETE |

## TakePhoto

photo.html

```javascript
<html>
  <head>
    <title>takePhoto</title>
    <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="preview.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="プレビューを開始" onclick="preview_start();"/><br />
        <input type="button" value="プレビューを終了" onclick="preview_stop();"/><br />
        <img id="image" width="500"/>
  </body>
</html>
```

photo.js

```javascript
function preview_start() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/preview?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";

    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
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

function preview_stop() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/preview?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";

    var header = null;
    var data = null;
    dConnect.delete(uri, header, data, function(json) {
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
