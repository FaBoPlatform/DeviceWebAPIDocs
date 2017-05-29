function preview_start() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/preview?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";

    var header = null;
    var data = null;
    dConnect.put(uri, header, data, function(json) {
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

function preview_stop() {
    var imageElement = document.getElementById("image");
    var uri = "http://192.168.0.15:4035/gotapi/mediastreamRecording/preview?serviceId=Host.ebc9a9ec2354491f929dd4b25abccb6.localhost.deviceconnect.org";

    var header = null;
    var data = null;
    dConnect.delete(uri, header, data, function(json) {
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


function changeAngle(mAngle) {
    console.log(mAngle);
    angle = mAngle;
}

function move(speed) {
    var uri = "http://192.168.0.15:4035/gotapi/driveController/move?serviceId=gpio_service_id.4de8d7e836faab7ad1da5a7ea7737963.localhost.deviceconnect.org"
    var header = null;
    var data = "speed="+speed;
    data += "&angle="+angle;
    dConnect.post(uri, header, data, function(json) {
        if (json.result == 0) {
            console.log(json);
        } else {
            console.log(json.result);
        }

    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}