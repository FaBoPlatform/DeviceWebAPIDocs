function takePhoto() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/takePhoto?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";
    dConnect.post(uri , null, null, function(json) {
        if (json.result == 0) {
            var uri = json.uri
            imageElement.src = uri;
            console.log(uri);
        } else {
            console.log(json.result);
        }

    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}