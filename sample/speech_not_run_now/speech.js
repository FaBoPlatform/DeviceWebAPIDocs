var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.onresult = function(event) {
    for (var i = event.resultIndex; i < event.results.length; ++i) {
        var result = event.results[event.resultIndex][0];
        console.log(result.transcript);
        var str = result.transcript;
        if(str.indexOf("すすめ")) {
            move(1);
            console.log("GO!!");
        } else if((str.indexOf("とまれ")) {
            move(0);
            console.log("STOP!!");
        }
        
    }
}