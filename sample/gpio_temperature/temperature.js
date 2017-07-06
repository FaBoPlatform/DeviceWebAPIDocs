function arduino_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function temperature() {
    var valueElement = document.getElementById("value");
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/analog/A0?serviceId=" + gpioId;
    console.log(uri);
    dConnect.get(uri, null, function(json) {
        console.log(json);
        if (json.result == 0) {
            var value = json.value;
            console.log(value);
            volt = arduino_map(value, 0, 1023, 0, 5000);
            temperatureValue = arduino_map(volt, 300, 1600, -30, 100);
            temperatureValue = Math.round(temperatureValue*10)/10;
            valueElement.innerHTML = "<h1>" + temperatureValue + "</h1>";
        }
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
