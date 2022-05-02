"use strict";

const app = require("./shared/setup");

const messageboardService = require("./lib/messageboard-service");

messageboardService.activateRoutes(app);
//TODO: Can possibly improve this to use a predefined port by environment variable. Does that make sense in the context of Docker/ CI-CD ?
const port = process.env.PORT || 4205;
app.listen(port, () =>
  console.log(`Messageboard Service is listening on port: ${port}`)
);
