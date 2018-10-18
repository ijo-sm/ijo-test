#!/usr/bin/env node
const Tester = require("./src/tester");

global.Logger = require("./src/logger");
global.Utils = require("./src/utils/utils");
global.tester = new Tester();
tester.run();