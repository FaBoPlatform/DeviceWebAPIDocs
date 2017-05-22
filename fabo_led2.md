# LEDの操作(JavaScript)

## LEDの操作

|操作|Endpoint|メソッド|
|:--|:--|:--|
|LEDの状態の変更|http://$IP:4035/gotapi/gpio/digital/D2?serviceId=#####|POST|
|LEDの点灯|http://$IP:4035/gotapi/gpio/digital/D2?serviceId=#####|PUT|
|LEDの消灯|http://$IP:4035/gotapi/gpio/digital/D2?serviceId=#####|DELETE|
|LEDの状態の取得|http://$IP:4035/gotapi/gpio/digital/D2?serviceId=#####|GET|

## LEDを点灯する

まず、LEDを点灯するサンプルを作成します。LEDの点灯にはPUTメソッドを用います。

LED.html

```javascript
<html>
  <head>
	<title>LED</title>
	<script src="js/dconnectsdk-2.0.0.js" type="text/javascript"></script>
	<script src="LED.js" type="text/javascript"></script>
  </head>
  <body>
    	<input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
  </body>
</html>
```

LED.js

```javascript
var serviceId="#########"

function LEDOn() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();

  dConnect.put(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

```

## LEDを消灯する

まず、LEDを点灯するサンプルを作成します。LEDの点灯にはPUTメソッドを用います。

LED.html

```javascript
<html>
  <head>
  <title>LED</title>
  <script src="js/dconnectsdk-2.0.0.js" type="text/javascript"></script>
  <script src="LED.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
  </body>
</html>
```

LED.js

```javascript
var serviceId="#########"

function LEDOn() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();

  dConnect.put(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDOff() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();  

  dConnect.delete(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}
```

## LEDの状態を変える

次に、LEDの状態を変えてみます。

LED.html

```javascript
<html>
  <head>
  <title>LED</title>
  <script src="js/dconnectsdk-2.0.0.js" type="text/javascript"></script>
  <script src="LED.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
      <input type="button" value="LEDを点灯" onclick="LEDChange(1);"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDChange(0);"/><br />
  </body>
</html>
```

LED.js

```javascript

var serviceId="#########"

function LEDOn() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();

  dConnect.put(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDOff() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();  

  dConnect.delete(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDChange(int value) {

  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  builder.addParameter("value", value);
  var uri = builder.build(); 

  dConnect.post(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}
```

## LEDの状態を取得する

次に、LEDの状態を取得してみます。

LED.html

```javascript
<html>
  <head>
  <title>LED</title>
  <script src="js/dconnectsdk-2.0.0.js" type="text/javascript"></script>
  <script src="LED.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="LEDを点灯" onclick="LEDOn();"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDOff();"/><br />
      <input type="button" value="LEDを点灯" onclick="LEDChange(1);"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDChange(0);"/><br />
      <input type="button" value="LEDを消灯" onclick="LEDStatus();"/><br />
  </body>
</html>
```

LED.js

```javascript

var serviceId="#########"

function LEDOn() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();

  dConnect.put(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDOff() {
  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build();  

  dConnect.delete(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDChange(int value) {

  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  builder.addParameter("value", value);
  var uri = builder.build(); 

  dConnect.post(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}

function LEDStatus() {

  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setServiceId(serviceId);
  var uri = builder.build(); 

  dConnect.get(uri, null, function(json) {
    alert(json.result);
  }, function(errorCode, errorMessage) {
    alert(errorMessage);
  });
}
```
