var serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var ip = "192.168.0.83";

function drive() {
  var imageElement = document.getElementById("image");

  dConnect.setHost(ip);

  var builder = new dConnect.URIBuilder();
    builder.setProfile("driveController");
    builder.setAttribute("move");
    builder.setServiceId(serviceId);

    var uri = builder.build();
    //alert(uri);
    var header = null;
    var data = "speed=0";
    data += "&angle=0"
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