# 4.3 RobotCarの操作(JavaScript)

## RESTFUL

|操作|Endpoint|メソッド|
|:--|:--|:--|
|前進(speed=1)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=0|POST|
|後進(speed=-1)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=-1&angle=0|POST|
|停止(speed=0)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=0&angle=0|POST|
|回転(angle=360)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=360|POST|
|回転(angle=-360)|http://IP:4035/gotapi/driveController/move?serviceId=####&speed=1&angle=-360|POST|

## URLによる擬似的なRESTFUL

|操作|Endpoint|
|:--|:--|
|前進(speed=1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=0|
|後進(speed=-1)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=-1&angle=0|
|停止(speed=0)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=0&angle=0|
|回転(angle=360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=360|
|回転(angle=-360)|http://IP:4035/gotapi/post/driveController/move?serviceId=####&speed=1&angle=-360|

## Sample

HTML/JavaScriptのサンプルは`/sample/robot_sample/`フォルダに置かれています。
controller.htmlをChrome Browserにドラッグ&ドロップし、実行します。

![](../img/robotsample001.png)

controller.html

```html
<html>
  <head>
    <title>takePhoto</title>
    <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="controller.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="プレビューを開始" onclick="preview_stop();"/><br />
        <input type="button" value="プレビューを終了" onclick="preview_start();"/><br />
        <img id="image" width="500"/><br />
        <input type="button" value="↑" onclick="move(1);"/><br />
        <input type="button" value="■" onclick="move(0);"/><br />
        <input type="button" value="↓" onclick="move(-1);"/><br />
        <input type="range" min="-360" max="360" step="10" onchange="changeAngle(this.value);">
  </body>
</html>
```


controller.js

```javascript
var angle = 0;
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
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}


function changeAngle(mAngle) {
    console.log(mAngle);
    angle = mAngle;
}

function move(speed) {
    var uri = "http://" + ip + ":" + port + "/gotapi/driveController/move?serviceId=" + mouseId;
    var header = null;
    var data = "speed="+speed;
    data += "&angle="+angle;
    dConnect.post(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
```

## 実際の操作

controller.htmlをブラウザで開くと，以下のような画面が開く．

![](../img/controller01.png)

このボタンなどを押すことで，ラジコンカーを実際に操作できる．以下はコントローラーの各ボタンなどの役割である．

![](../img/controller02.png)