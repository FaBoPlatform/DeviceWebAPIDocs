var serviceId="Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
var ip = "192.168.0.83";

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
            var uri = json.uri;
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

var fabo_serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";

function move(speed) {
  dConnect.setHost(ip);

  var builder = new dConnect.URIBuilder();
    builder.setProfile("driveController");
    builder.setAttribute("move");
    builder.setServiceId(fabo_serviceId);

    var uri = builder.build();
    //alert(uri);
    var header = null;
    var data = "speed="+speed;
    data += "&angle=0";
    dConnect.post(uri, header, data, function(json) {
        if (json.result == 0) {
            console.log(json);

        } else {
            alert(json.result);
        }

    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}
