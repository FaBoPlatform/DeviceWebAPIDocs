var serviceId="Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
var ip = "192.168.0.68";

function takePhoto() {
    var imageElement = document.getElementById("image");
    dConnect.setHost(ip);
  
    //var builder = new dConnect.URIBuilder();
    //builder.setProfile("mediastreamRecording");
    //builder.setAttribute("takePhoto");
    //builder.setServiceId(serviceId);

    //var uri = builder.build();
    //alert(uri);
    var uri = "http://192.168.0.68:4035/gotapi/mediastreamRecording/takePhoto?serviceId=" + serviceId;
    dConnect.post(uri , null, null, function(json) {
        if (json.result == 0) {
            var uri = json.uri
            uri = uri.replace(/localhost/g , ip);
            imageElement.src = uri;
        } else {
            alert(json.result);
        }

    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}