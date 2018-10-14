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

module.exports = class Fork {
	constructor(config, options = {}) {
		this.options = Object.assign({}, options, {
			path: "/",
			name: "",
			prefix: "p:",
			keepAlive: false
		}, options);
		this.config = config;
		this.tries = 0;
	}

	start() {
		this.process = ChildProcess.fork(this.options.path, [], {cwd: Utils.path.get() + "/test", stdio: ['ipc', 'pipe', 'pipe']});

		this.process.stdout.on('data', (data) => {
			process.stdout.write(prefixProcessLines(data.toString(), this.options.prefix));
		});
		
		this.process.stderr.on('data', (data) => {
			process.stderr.write(prefixProcessLines(data.toString(), this.options.prefix));
		});

		this.process.on('error', (err) => {
			Logger.info(this.options.name, "failed", err + ", stack:\n", err.stack);
		});
		
		this.process.on('close', (code) => {
			Logger.info(this.options.name, "exited with code", code);

			if(typeof this.options.keepAlive === "number" && this.options.keepAlive > this.tries) {
				Logger.info(this.options.name, "restarting");

				this.tries++;
				this.start();
			}
			else {
				Logger.profile(this.options.name, "info", "ending");
			}
		});
	}
}