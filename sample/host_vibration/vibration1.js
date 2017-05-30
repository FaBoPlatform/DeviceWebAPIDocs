function vibration() {

    var uri = "http://" + ip + ":" + port + "/gotapi/vibration/vibrate?serviceId=" + hostId;
    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}