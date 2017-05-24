# プレビュー

## プレビュー

|操作|Endpoint|メソッド|
|:--|:--|:--|
|写真の撮影| http://IP:4035/gotapi/mediaStreaming/preview?serviceId=##### | PUT |

## TakePhoto

photo.html

```javascript
<html>
  <head>
    <title>takePhoto</title>
    <script src="dconnectsdk-2.2.0.js" type="text/javascript"></script>
    <script src="preview.js" type="text/javascript"></script>
  </head>
  <body>
        <input type="button" value="プレビューを開始" onclick="preview();"/><br />
        <img id="image" width="500"/>
  </body>
</html>
```

photo.js

```javascript
var serviceId="############################################";
var ip = "###.###.##.##";

function preview() {
  var imageElement = document.getElementById("image");

  dConnect.setHost(ip);

  var builder = new dConnect.URIBuilder();
    builder.setProfile("mediastreamRecording");
    builder.setAttribute("preview");
    builder.setServiceId(serviceId);

    var uri = builder.build();
    
    dConnect.put(uri, null, null, function(json) {
        if (json.result == 0) {
            var uri = json.uri
            uri = uri.replace(/localhost/g , ip);
            imageElement.src = uri;
            //alert(uri);
        } else {
            alert(json.result);
        }

    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}

```
