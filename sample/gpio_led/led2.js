function LEDOn() {
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
    var header = null;
    var data = null;
    dConnect.put(uri, header, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}

function LEDOff() {
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + faboId;
    var header = null;
    var data = null;
    dConnect.delete(uri, header, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
