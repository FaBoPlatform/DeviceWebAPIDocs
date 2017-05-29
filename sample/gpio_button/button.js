var serviceId="gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org";
var ip = "192.168.0.68";
var accessToken="2e19e853ed533e80070d6705da807d0f785f633c1b0a52f5174976a69bfcb846721f75e914195128"

function registerEvent() {
    dConnect.setHost(ip);

    var builder = new dConnect.URIBuilder();
    builder.setProfile("gpio");
    builder.setInterface("onChange");
    builder.setServiceId(serviceId);
    builder.setSessionKey("TEST1");
    builder.setAccessToken(accessToken);

    var uri = builder.build();
    console.log(uri);
    dConnect.addEventListener(uri,
        function(message) {
            console.log(message);
            var json = JSON.parse(message);
            console.log(json);
            var pins = json.pins;
            if(pins[2] == 1) {
              document.bgColor = "#ff0000";
            } else {
              document.bgColor = "#ffffff";
            }
        },
        function() {
          alert("イベント登録しました。");
        },
        function(errorCode, errorMessage) {
          alert(errorMessage);
        });
}

function unregisterEvent() {
    dConnect.setHost(ip);

    var builder = new dConnect.URIBuilder();
    builder.setProfile("gpio");
    builder.setInterface("onChange");
    builder.setServiceId(serviceId);
    builder.setSessionKey("TEST1");
    builder.setAccessToken(accessToken);

    var uri = builder.build();
    console.log(uri);
    dConnect.removeEventListener(uri, function() {
      alert("イベント登録を削除しました。");
    }, function(errorCode, errorMessage) {
      alert(errorMessage);
    });
}