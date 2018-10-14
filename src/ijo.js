const ChildProcess = require("child_process");

function prefixProcessLines(data, prefix) {
	let lines = data.split("\n");

	for(var i = 0; i < lines.length; i++) {
		if(lines[i] === "") {
			continue;
		}

		lines[i] = prefix + lines[i];
	}

	return lines.join("\n");
}

module.exports = class IJO {
	constructor(config) {
		this.config = config;
		this.tries = 0;
	}

	start() {
		this.process = ChildProcess.fork("panel/index", [], {cwd: Utils.path.get() + "/test", stdio: ['ipc', 'pipe', 'pipe']});

		this.process.stdout.on('data', (data) => {
			process.stdout.write(prefixProcessLines(data.toString(), "> "));
		});
		
		this.process.stderr.on('data', (data) => {
			process.stderr.write(prefixProcessLines(data.toString(), "> "));
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