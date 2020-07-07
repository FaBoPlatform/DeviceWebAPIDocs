var recognition = new webkitSpeechRecognition();
recognition.continuous = true;

recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        var result = event.results[event.resultIndex][0];        
        var str = result.transcript;
        console.log("音声認識した言葉:" + str);
        var wordHtml = document.getElementById("word");
        wordHtml.innerHTML = "認識したワード:" + str;
        if(str.indexOf("すすめ") != -1 || str.indexOf("進め") != -1 ) {
            move(1);
            console.log("GO");
        } else if(str.indexOf("とまれ") != -1  || str.indexOf("止まれ") != -1 ) {
            move(0);
            console.log("STOP");
        } else if(str.indexOf("ひだりかいてん") != -1 || str.indexOf("左回転") != -1 ) {
            changeAngle(360);
            move(1);
            console.log("LEFT");
        } else if(str.indexOf("みぎかいてん") != -1  || str.indexOf("右回転") != -1 ) {
            changeAngle(-360);
            move(1);
            console.log("RIGHT");
        } else {
            console.log("NO COMMAND");
        }
        
    }
}