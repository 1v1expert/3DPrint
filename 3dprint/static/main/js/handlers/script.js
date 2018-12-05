OctoPrint.socket.onMessage("*", function(message) {
    console.log(message);
});

OctoPrint.socket.connect()

OctoPrint.browser.login("vladdos", "@WSX2wsx123", true)
    .done(function(response) {
        console.log(response, 'succes')
    });

OctoPrint.options.baseurl = "http://localhost:5000"

OctoPrint.options.apikey = ActiveApi
