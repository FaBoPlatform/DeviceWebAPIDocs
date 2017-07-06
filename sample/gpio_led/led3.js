function LEDOn() {
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + gpioId;
    var header = null;
    var data = null;
    dConnect.put(uri, header, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}

function LEDOff() {
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + gpioId;
    var header = null;
    var data = null;
    dConnect.delete(uri, header, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}

function LEDChange(value) {
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/digital/D2?serviceId=" + gpioId;
    var header = null;
    var data = "value="+value;
    dConnect.post(uri, header, data, function(json) {
        console.log(json);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
