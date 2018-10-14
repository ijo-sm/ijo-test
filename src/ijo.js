const Utils = require('./utils');
const ChildProcess = require("child_process");

module.exports = class IJO {
	constructor(config) {
		this.config = config;
		this.tries = 0;
	}

	start() {
		this.process = ChildProcess.fork("panel/index", [], {cwd: Utils.path() + "/test", stdio: ['ipc', 'pipe', 'pipe']});

		this.process.stdout.on('data', (data) => {
			process.stdout.write(Utils.prefixLines(data.toString(), "> "));
		});
		
		this.process.stderr.on('data', (data) => {
			process.stderr.write(Utils.prefixLines(data.toString(), "> "));
		});

		this.process.on('error', (err) => {
			Logger.info("ijo", "failed", err + ", stack:\n", err.stack);
		});
		
		this.process.on('close', (code) => {
			Logger.info("ijo", "exited with code", code);

			if(typeof this.config.keep_alive === "number" && this.config.keep_alive > this.tries) {
				Logger.info("ijo", "restarting");

				this.tries++;
				this.start();
			}
			else {
				Logger.profile("test", "info", "ending");
			}
		});
	}
}