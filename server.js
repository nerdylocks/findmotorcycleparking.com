var connect = require('connect');
connect.createServer(
    connect.static(__dirname)
);

var port = process.env.PORT || 3000;
connect.listen(port, function() {
  console.log("Listening on " + port);
});