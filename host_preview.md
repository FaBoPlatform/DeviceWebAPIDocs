# プレビュー

## プレビュー

|操作|Endpoint|メソッド|
|:--|:--|:--|
|プレビューの開始| http://IP:4035/gotapi/mediaStreaming/preview?serviceId=##### | PUT |
|プレビューの終了| http://IP:4035/gotapi/mediaStreaming/preview?serviceId=##### | DELETE |

## Preview

preview.html

```javascript
<html>
  <head>
    <title>takePhoto</title>
    <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
    <script src="controller.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="プレビューを開始" onclick="preview_start();"/><br />
        <input type="button" value="プレビューを終了" onclick="preview_stop();"/><br />
        <img id="image" width="500"/><br />
        <input type="button" value="↑" onclick="move(1);"/><br />
        <input type="button" value="■" onclick="move(0);"/><br />
        <input type="button" value="↓" onclick="move(-1);"/><br />
        <input type="range" min="-360" max="360" step="10" onchange="changeAngle(this.value)">
  </body>
</html>
```

preview.js

```javascript
function preview_start() {
    var imageElement = document.getElementById("image");
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/preview?serviceId=" + hostId;

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
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/preview?serviceId=" + hostId;;

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
