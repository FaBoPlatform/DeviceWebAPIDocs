var angle = 0;
function preview_start() {
    var imageElement = document.getElementById("image");
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/preview?serviceId=" + hostId;

    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
        if (json.result == 0) {
            var uri = json.uri;
            console.log(uri);
            uri = uri.replace(/localhost/g,ip);
            imageElement.src = uri;
            console.log(uri);
        } else {
            console.log(json.result);
        }

    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}

function preview_stop() {
    var imageElement = document.getElementById("image");
    var uri = "http://" + ip + ":" + port + "/gotapi/mediastreamRecording/preview?serviceId=" + hostId;

    var header = null;
    var data = null;
    dConnect.delete(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}


function changeAngle(mAngle) {
    console.log(mAngle);
    angle = mAngle;
}

function move(speed) {
    var uri = "http://" + ip + ":" + port + "/gotapi/driveController/move?serviceId=" + mouseId;
    var header = null;
    var data = "speed="+speed;
    data += "&angle="+angle;
    dConnect.post(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}