# 写真の撮影

## 写真の撮影

|操作|Endpoint|メソッド|
|:--|:--|:--|
|写真の撮影| http://IP:4035/gotapi/mediastreamRecording/takePhoto?serviceId=###################### | POST |

## TakePhoto

HTML/JavaScriptのサンプルは`/sample/host_takePhoto/`フォルダに置かれています。
takePhoto.htmlをChrome Browserにドラッグ&ドロップし、実行します。

![](/img/sample_takephoto.png)


takePhoto.html

```html
<html>
    <head>
        <title>takePhoto</title>
        <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
        <script src="../lib/setting.js" type="text/javascript"></script>
        <script src="takePhoto.js" type="text/javascript"></script>
    </head>
    <body>
        <input type="button" value="写真を撮影" onclick="takePhoto();"/><br />
        <img id="image" width="500"/>
    </body>
</html>
```

takePhoto.js

```javascript
function takePhoto() {
    var imageElement = document.getElementById("image");
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/takePhoto?serviceId=" + hostId;
    dConnect.post(uri , null, null, function(json) {
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
```
