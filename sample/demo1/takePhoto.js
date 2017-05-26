var serviceId=["Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org","Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org","Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org","Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org","Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org"];
var ip = ["192.168.0.68","192.168.0.72","192.168.0.83","192.168.0.74","192.168.0.64"];
var urls = [];
var d = 0;
function takePhoto() {

    for(var i = 0; i < ip.length; i++) {
        
        dConnect.setHost(ip[i]);
      
        var builder = new dConnect.URIBuilder();
        builder.setProfile("mediastreamRecording");
        builder.setAttribute("takePhoto");
        builder.setServiceId(serviceId[i]);

        var uri = builder.build();

        dConnect.post(uri , null, null, function(json) {
            if (json.result == 0) {
                var uri = json.uri
                //imageElement.src = urls[d];
                urls.push(uri)
            } else {
                alert(json.result);
            }

        }, function(errorCode, errorMessage) {
            alert(errorMessage);
        });
    }

    setInterval("play()",1000);
}

function play() {
    var imageElement = document.getElementById("image");
    imageElement.src = urls[d];
    d++;
    if(d >= urls.length) {
        d = 0;
    }
}