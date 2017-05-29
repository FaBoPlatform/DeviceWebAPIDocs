function arduino_map(x, in_min, in_max, out_min, out_max){
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min
}

function distance() {
    var valueElement = document.getElementById("value");
    var uri = "http://192.168.0.15:4035/gotapi/gpio/analog/A0?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
    
    dConnect.get(uri, null, function(json) {
        console.log(json);
        if (json.result == 0) {
            var value = json.value
            volt = arduino_map(value, 0, 1023, 0, 5000);
            distanceValue = arduino_map(volt, 3200, 500, 5, 80);
            valueElement.innerHTML = "<h1>" + distanceValue + "</h1>";
        } 
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}