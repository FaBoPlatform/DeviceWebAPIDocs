function arduino_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function light() {
    var valueElement = document.getElementById("value");
    var uri = "http://" + ip + ":" + port + "/gotapi/gpio/analog/A0?serviceId=" + faboId;
    console.log(uri);
    dConnect.get(uri, null, function(json) {
        console.log(json);
        if (json.result == 0) {
            var value = json.value
            console.log(value)
            valueElement.innerHTML = "<h1>" + value + "</h1>";
        }
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
