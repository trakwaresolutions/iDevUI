onmessage = function(event) {
    var message = "Your name is " + event.data;
    postMessage(message);
};