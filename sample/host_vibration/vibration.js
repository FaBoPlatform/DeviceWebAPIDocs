function vibration() {

    var uri = "http://192.168.0.15:4035/gotapi/vibration/vibrate?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}