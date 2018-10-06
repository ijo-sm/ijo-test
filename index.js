#!/usr/bin/env node
const Utils = require('./src/utils');
const ChildProcess = require("child_process");
const TestFolder = require("./src/folders");
global.Logger = new (require("./src/logger"))("debug");

let config;
let defaults = require("./res/defaults/config.json");

function startIJO(keepAlive = 0) {
	let IJO = ChildProcess.fork("panel/index", [], {cwd: Utils.path() + "/test", stdio: ['ipc', 'pipe', 'pipe']});

	IJO.stdout.on('data', (data) => {
		process.stdout.write("> " + data.toString());
	});
	
	IJO.stderr.on('data', (data) => {
		process.stderr.write("> " + data.toString());
	});

	IJO.on('error', (err) => {
		Logger.info("ijo", "failed", err + ", stack:\n", err.stack);
	});
	
	IJO.on('close', (code) => {
		Logger.info("ijo", "exited with code", code)

		if(typeof keepAlive === "number" && keepAlive > 0) {
			Logger.info("ijo", "restarting")
			startIJO(keepAlive--);
		}
		else {
			Logger.profile("test", "info", "ending");
		}
	});
}

var runTest = async function() {
	Utils.lazyCatch(() => config = require(Utils.path() + "/test.json"));

	if(config === undefined) {
		config = {};
	}

	config = Object.assign({}, config, defaults, config);

	Logger.level = config.logging_level;

	Logger.info("test", "starting");
	Logger.profile("test");

	Logger.debug("config", config);

	Logger.info("TestFolder", "creating");
	Logger.profile("TestFolder");
	await new TestFolder(config).create();
	Logger.profile("TestFolder", "info", "creating finished");

	Logger.info("ijo", "starting");
	startIJO(config.keep_alive);
};

runTest();

