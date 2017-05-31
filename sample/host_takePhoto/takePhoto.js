function takePhoto() {
    var imageElement = document.getElementById("image");
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/takePhoto?serviceId=" + hostId;
    dConnect.post(uri , null, null, function(json) {
        if (json.result == 0) {
            var uri = json.uri
            uri.replace(/localhost/g , ip);
            imageElement.src = uri;
            console.log(uri);
        } else {
            console.log(json.result);
        }

    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}