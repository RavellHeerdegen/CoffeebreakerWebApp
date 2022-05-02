"use strict";

const app = require("./shared/setup");

const coffeebreakService = require("./lib/coffeebreak-service");

coffeebreakService.activateRoutes(app);
//TODO: Can possibly improve this to use a predefined port by environment variable. Does that make sense in the context of Docker/ CI-CD ?
const port = process.env.PORT || 4204;
app.listen(port, () =>
  console.log(`Coffeebreak Service is listening on port: ${port}`)
);
