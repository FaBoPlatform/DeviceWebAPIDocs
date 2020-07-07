# 3.3 プレビュー

## プレビュー

|操作|Endpoint|メソッド|
|:--|:--|:--|
|プレビューの開始| http://IP:4035/gotapi/mediastreamRecording/preview?serviceId=##### | PUT |
|プレビューの終了| http://IP:4035/gotapi/mediastreamRecording/preview?serviceId=##### | DELETE |

## Preview

HTML/JavaScriptのサンプルは`/sample/host_preview/`フォルダに置かれています。
preview.htmlをChrome Browserにドラッグ&ドロップし、実行します。

![](/img/sample_preview.png)

preview.html

```html
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
            var uri = json.uri;
            uri = uri.replace(/localhost/g , ip);
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
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/preview?serviceId=" + hostId;

    var header = null;
    var data = null;
    dConnect.delete(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
```
