const GitUtilities = require("./git");
const FileSystemUtilities = require("./fs");
const PathUtilities = require("./path");
const CMDUtilities = require("./cmd");

class ProcessUtilities {
	onExit(callback) {
		process.on('SIGINT', () => {
			callback();
		});
	}
}

class Utilities {
	constructor() {
		this.git = new GitUtilities();
		this.fs = new FileSystemUtilities();
		this.path = new PathUtilities();
		this.cmd = new CMDUtilities();
		this.process = new ProcessUtilities();
	}

	lazyCatch(callback) {
		try {
			callback();
		}
		catch(e) {}
	}
}

module.exports = new Utilities();