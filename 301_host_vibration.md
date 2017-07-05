# バイブレーション

## バイブレーションを動作させる

|操作|Endpoint|メソッド|
|:--|:--|:--|
|バイブレーション| http://IP:4035/gotapi/vibration/vibrate?serviceId=##### | PUT |

## URLによる擬似的なRESTFUL

|操作|Endpoint|
|:--|:--|
|バイブレーション| http://IP:4035/gotapi/put/vibration/vibrate?serviceId=##### |

# バイブレーションを動作

## ブラウザからの起動(PUT)

ブラウザからの起動では、Chroneのアドレスバーに下記 Endpointを入力し、Enterで呼び出します。

> http://192.168.0.15:4035/gotapi/put/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org

## HTML/JavaScript

HTML/JavaScriptのサンプルは`/sample/host_vibrtion/`フォルダに置かれています。
vibration1.htmlをChrome Browserにドラッグ&ドロップし、実行します。

![](/img/sample_vibration.png)

## サンプル1

vibration1.html

```html
<html>
  <head>
    <title>Vibration</title>
    <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
    <script src="vibration1.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="バイブレーションを振動" onclick="vibration();"/><br />
  </body>
</html>
```

vibration1.js

```javascript
function vibration() {

    var uri = "http://" + ip + ":" + port + "/gotapi/vibration/vibrate?serviceId=" + hostId;
    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
```

# バイブレーションを動作

## ブラウザからの起動(PUT)

URLの最後に、&をつけてpattern=100,1000,100,100を追加します。

> http://192.168.0.68:4035/gotapi/put/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org&pattern=100,1000,100,1000

## HTML/JavaScript

HTML/JavaScriptのサンプルの実行は`/sample/host_vibration/`フォルダにサンプルが置かれています。
vibration1.htmlをChrome Browserにドラッグ&ドロップし、読み出します。

## サンプル2

vibration2.html

```html
<html>
  <head>
    <title>Vibration</title>
    <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
    <script src="vibration2.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="バイブレーションを振動" onclick="vibration();"/><br />
  </body>
</html>
```

vibration2.js

```javascript
function vibration() {

    var uri = "http://" + ip + ":" + port + "/gotapi/vibration/vibrate?serviceId=" + hostId;
    var header = null;
    var data = "pattern=100,1000,100,1000";
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}
```
