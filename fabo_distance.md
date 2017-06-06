# 距離を取得

距離センサーをA0のPINに差し込みます。

![](/img/distance001.png)

![](/img/distance002.png)

## 距離を取得

distance.html

```html
<html>
  <head>
    <title>distance</title>
    <script src="../lib/dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="../lib/setting.js" type="text/javascript"></script>
    <script src="distance.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="距離を取得" onclick="distance();"/><br />
        <div id="value"></div>
  </body>
</html>
```

distance.js

```javascript
function arduino_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function distance() {
    var valueElement = document.getElementById("value");
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/analog/A0?serviceId=" + faboId;
    console.log(uri);
    dConnect.get(uri, null, function(json) {
        console.log(json);
        if (json.result == 0) {
            var value = json.value
            volt = arduino_map(value, 0, 1023, 0, 5000);
            distanceValue = arduino_map(volt, 3200, 500, 5, 80);
            valueElement.innerHTML = "<h1>" + distanceValue + "</h1>";
        }
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
```
