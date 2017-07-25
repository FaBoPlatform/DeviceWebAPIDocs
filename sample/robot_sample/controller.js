var BIAS = 1; // 左右のスピードのバイアス値(ここを調整し左右のモータの速さの調整をする)
var SPEED = 1; // スピードの初期値
var now_speed = 0; // 現在のスピードを格納

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


function change_angle(angle) {
    console.log(now_speed);
    console.log(angle);
    move(now_speed, angle);
}

function run_forward() {
    move(SPEED, 0);
    now_speed = SPEED;
}

function run_back() {
    move(-SPEED, 0);
    now_speed = -SPEED;
}

function move(speed, angle) {
    var uri = "http://" + ip + ":" + port + "/gotapi/driveController/move?serviceId=" + mouseId;

    var header = null;
    var data = "speed="+speed;
    angle = Number(angle) + Number(BIAS);
    if(angle > 360) {
        angle = 360;
    } else if(angle < -360) {
        angle = -360;
    }
    data += "&angle="+angle;
    
    dConnect.post(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}

function stop() {
    var uri = "http://" + ip + ":" + port + "/gotapi/driveController/stop?serviceId=" + mouseId;
    now_speed = 0;
    var header = null;
    var data = null;
    dConnect.delete(uri, header, data, function(json) {
        console.log(json.result);
    }, function(errorCode, errorMessage) {
        console.log(errorMessage);
    });
}
