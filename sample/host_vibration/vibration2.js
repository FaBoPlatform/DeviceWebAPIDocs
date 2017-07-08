function vibration() {

    var uri = "http://" + ip + ":" + port + "/gotapi/vibration/vibrate?serviceId=" + hostId;
    var header = null;
    var data = "pattern=100,1000,100,1000";
    dConnect.put(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}