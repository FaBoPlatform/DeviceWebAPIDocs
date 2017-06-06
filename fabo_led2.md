# LEDの操作(JavaScript)

## LEDの操作

|操作|Endpoint|メソッド|
|:--|:--|:--|
|LEDの状態の変更|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|POST|
|LEDの点灯|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|PUT|
|LEDの消灯|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|DELETE|
|LEDの状態の取得|http://IP:4035/gotapi/gpio/digital/D2?serviceId=#####|GET|

## LEDを点灯する(PUT)

まず、LEDを点灯するサンプルを作成します。LEDの点灯にはPUTメソッドを用います。

led1.html

```html
<html>
  <head>
  <title>LED</title>
  <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
  <script src="led1.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
  </body>
</html>
```

led1.js

```javascript
function LEDOn() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.put(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}
```

## LEDを消灯する(DELETE)

まず、LEDを点灯するサンプルを作成します。LEDの点灯にはPUTメソッドを用います。

led2.html

```javascript
<html>
  <head>
  <title>LED</title>
  <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
  <script src="led2.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
        <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
  </body>
</html>
```

led2.js

```javascript
function LEDOn() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.put(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDOff() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.delete(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}
```

## LEDの状態を変える(POST)

次に、LEDの状態を変えてみます。

led3.html

```javascript
<<html>
  <head>
  <title>LED</title>
  <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
  <script src="../lib/setting.js" type="text/javascript"></script>
  <script src="led3.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
        <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
        <input type="button" value="LEDを点灯" onclick="LEDChange(1);"/><br />
        <input type="button" value="LEDを消灯" onclick="LEDChange(0);"/><br />
  </body>
</html>
```

led3.js

```javascript
function LEDOn() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.put(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDOff() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.delete(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDChange(value) {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = "value="+value;
  dConnect.post(uri, header, data, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}
```

## LEDの状態を取得する(GET)

次に、LEDの状態を取得してみます。

led4.html

```javascript
<html>
  <head>
  <title>LED</title>
  <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
  <script src="../lib/setting.js" type="text/javascript"></script>
  <script src="led4.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
        <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
        <input type="button" value="LEDを点灯" onclick="LEDChange(1);"/><br />
        <input type="button" value="LEDを消灯" onclick="LEDChange(0);"/><br />
        <input type="button" value="LEDの状態を取得" onclick="LEDStatus();"/><br />
  </body>
</html>
```

led4.js

```javascript
function LEDOn() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.put(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDOff() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = null;
  dConnect.delete(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDChange(value) {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  var data = "value="+value;
  dConnect.post(uri, header, data, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDStatus() {
  var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
  var header = null;
  dConnect.get(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}


```
