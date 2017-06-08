# Buttonイベントの取得(JavaScript)

## Buttonイベント

|操作|Endpoint|メソッド|
|:--|:--|:--|
|イベントの登録|http://192.168.0.10:4035/gotapi/gpio/onchange/?serviceId=#####|PUT|
|イベントの削除|http://192.168.0.10:4035/gotapi/gpio/onchange/?serviceId=#####|DELETE|

## Buttonイベントの登録

イベントの登録は、dconnectsdk-2.2.0.jsのdConnect.addEventListener()で登録をおこない、 dConnect.removeEventListener()で
登録の削除が可能になります。イベント登録する事で、WebSocketを経由して、リアルタイムに値の変化を取得できるようになります。

## HTML/JavaScript

HTML/JavaScriptのサンプルは`/sample/gpio_button/`フォルダに置かれています。
button.htmlをChrome Browserにドラッグ&ドロップし、実行します。

button.html

```html
<html>
  <head>
  <title>BUTTON</title>
  <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
  <script src="button.js" type="text/javascript"></script>
  </head>
  <body>
      <input type="button" value="イベントの登録" onclick="registerEvent();"/><br />
      <input type="button" value="イベントの登録の削除" onclick="unregisterEvent();"/><br />
  </body>
</html>
```

led1.js

```javascript
var serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var ip = "192.168.0.59";

/*
 * Register onChange event<br>
 * PUT: /gpio/onchange
 *
 * @param {String} serviceId service ID
 */
function doRegisterOnChangeEvent(serviceId) {

    var sessionKey = currentClientId;

    var builder = new dConnect.URIBuilder();
    builder.setProfile("gpio");
    builder.setInterface("onchange");
    builder.setAttribute("");
    builder.setServiceId(serviceId);
    builder.setAccessToken(accessToken);
    builder.setSessionKey(sessionKey);
    var uri = builder.build();

    dConnect.addEventListener(uri,
        function(message) {
            var json = JSON.parse(message);
            var pins = json.pins;
            if(pins[2] == 1) {
              document.bgColor = "#ff0000";
            } else {
              document.bgColor = "#ffffff";
            }
        },
        function() {

        },
        function(errorCode, errorMessage) {
            alert(errorMessage);
        });
}

/*
 * Unregister onChange event<br>
 * DELETE: /gpio/onchange
 *
 * @param {String} serviceId service ID
 */
function doUnregisterOnChangeEvent(serviceId) {

    var sessionKey = currentClientId;

    var builder = new dConnect.URIBuilder();
    builder.setProfile("gpio");
    builder.setInterface("onchange");
    builder.setAttribute("");
    builder.setServiceId(serviceId);
    builder.setAccessToken(accessToken);
    builder.setSessionKey(sessionKey);
    var uri = builder.build();

    dConnect.removeEventListener(uri, function() {
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}
```
