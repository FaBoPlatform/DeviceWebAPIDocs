function LEDOn() {
  var uri = "http://192.168.0.15:4035/gotapi/gpio/digital/D2?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
  var header = null;
  var data = null;
  dConnect.put(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDOff() {
  var uri = "http://192.168.0.15:4035/gotapi/gpio/digital/D2?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
  var header = null;
  var data = null;
  dConnect.delete(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDChange(value) {
  var uri = "http://192.168.0.15:4035/gotapi/gpio/digital/D2?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
  var header = null;
  var data = "value="+value;
  dConnect.post(uri, header, data, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}

function LEDStatus() {
  var uri = "http://192.168.0.15:4035/gotapi/gpio/digital/D2?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
  var header = null;
  dConnect.get(uri, header, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}
