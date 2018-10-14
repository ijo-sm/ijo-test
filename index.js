#!/usr/bin/env node
global.Logger = new (require("./src/logger"))("debug");
const Tester = require("./src/tester");

new Tester().run();