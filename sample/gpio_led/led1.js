var serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var ip = "192.168.0.59";

function LEDOn() {
  dConnect.setHost(ip);

  var builder = new dConnect.URIBuilder();
  builder.setProfile("gpio");
  builder.setInterface("digital");
  builder.setAttribute("D2");
  builder.setServiceId(serviceId);
  var uri = builder.build();

  var header = null;
  var data = null;
  dConnect.put(uri, header, data, function(json) {
    console.log(json);
  }, function(errorCode, errorMessage) {
    console.log(errorMessage);
  });
}