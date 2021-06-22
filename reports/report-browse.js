var connect = require('connect');
var serveStatic = require('serve-static');
connect()
    .use(serveStatic(__dirname + "/../coverage"))
    .listen(3003, function () {
        logger.info("Server running on 3003...");
        logger.info("Goto http://localhost:3003  to View HTML Report");
    });
