# バイブレーション

## バイブレーションを振動させる

|操作|Endpoint|メソッド|
|:--|:--|:--|
|バイブレーション| http://IP:4035/gotapi/vibration/vibrate?serviceId=##### | PUT |

## ブラウザーからの起動

> http://192.168.0.15:4035/gotapi/put/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org

## サンプル

vibration.html

```javascript
<html>
  <head>
    <title>Vibration</title>
    <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="vibration.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="バイブレーションを振動" onclick="vibration();"/><br />
  </body>
</html>
```

vibration.js

```javascript
function vibration() {

    var uri = "http://192.168.0.15:4035/gotapi/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}
```

## バターンを変える


vibration.js

```javascript
function vibration() {

    var uri = "http://192.168.0.15:4035/gotapi/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
    var header = null;
    var data = "pattern=100,1000,100,1000";
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}
```
