var serviceId="Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
var ip = "192.168.0.15";

function vibration() {

  dConnect.setHost(ip);

  var builder = new dConnect.URIBuilder();
    builder.setProfile("vibration");
    builder.setAttribute("vibrate");
    builder.setServiceId(serviceId);

    var uri = builder.build();
    
    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        if (json.result == 0) {
            console.log(json);
        } else {
            alert(json.result);
        }

    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}