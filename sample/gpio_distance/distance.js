var serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var ip = "192.168.0.15";

function distance() {
    var valueElement = document.getElementById("value");

    dConnect.setHost(ip);

    var builder = new dConnect.URIBuilder();
    builder.setProfile("gpio");
    builder.setInterface("analog");
    builder.setAttribute("A0");
    builder.setServiceId(serviceId);

    var uri = builder.build();
    
    dConnect.get(uri, null, function(json) {
        if (json.result == 0) {
            var value = json.value
            alert(value);
            valueElement.innerHTML = "<h1>" + value + "</h1>";
        } else {
            alert(json.result);
        }

    }, function(errorCode, errorMessage) {
        alert(errorMessage);
    });
}