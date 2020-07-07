var recognition = new webkitSpeechRecognition();
recognition.continuous = true;

recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        var result = event.results[event.resultIndex][0];        
        var str = result.transcript;
        console.log("�����F���������t:" + str);
        var wordHtml = document.getElementById("word");
        wordHtml.innerHTML = "�F���������[�h:" + str;
        if(str.indexOf("������") != -1 || str.indexOf("�i��") != -1 ) {
            move(1);
            console.log("GO");
        } else if(str.indexOf("�Ƃ܂�") != -1  || str.indexOf("�~�܂�") != -1 ) {
            move(0);
            console.log("STOP");
        } else if(str.indexOf("�Ђ��肩���Ă�") != -1 || str.indexOf("����]") != -1 ) {
            changeAngle(360);
            move(1);
            console.log("LEFT");
        } else if(str.indexOf("�݂������Ă�") != -1  || str.indexOf("�E��]") != -1 ) {
            changeAngle(-360);
            move(1);
            console.log("RIGHT");
        } else {
            console.log("NO COMMAND");
        }
        
    }
}