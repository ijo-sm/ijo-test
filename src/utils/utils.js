const GitUtilities = require("./git");
const FileSystemUtilities = require("./fs");
const ChildProcess = require("child_process");
const exec = require('util').promisify(ChildProcess.exec);

class PathUtilities {
	match(path, token) {
		if(typeof token === "string") {
			return path.includes(token);
		}
		else if(token instanceof Array) {
			return token.map(token => this.match(path, token)).find(Boolean);
		}
		else if(token instanceof RegExp) {
			return path.match(token);
		}

		return false;
	}

	get() {
		return process.cwd().replace(/\\/g,"/");
	}

	getExactPackageName() {
		let pathArray = this.get().split("/");

		return pathArray[pathArray.length - 1];
	}

	getPackageName() {
		let packageName = this.getExactPackageName();

		if(packageName.startsWith("executor")) {
			packageName = "executor";
		}
		else if(packageName.startsWith("plugin")) {
			packageName = "plugin";
		}

		return packageName;
	}
}

class CMDUtilities {
	async tryCommand(command) {
		try {
			await this.execute("where " + command);
		}
		catch(e) {
			return false;
		}
	
		return true;
	}

	async execute(command, options = {}) {
		Logger.profile("cmd");

		var response = await exec(command, options);

		Logger.profile("cmd", "debug", `execute \"${command}\" in ${options.cwd || Utils.path.get()}`, );

		return response;
	}

	async forceInstallNPMPackage(packageName, options = {}) {
		if(!await this.tryCommand(packageName)) {
			Logger.profile("npm");

			this.checkForError(await this.execute(`npm install ${packageName}${options.global ? " -g" : ""}`, {cwd: options.cwd}));

			Logger.profile("npm", "debug", "install", packageName, options);
		}
	}

	checkForError(response) {
		if(response.stderr !== "" && !response.stderr.startsWith("npm WARN")) {
			throw new Error(response.stderr);
		}
	}
}

class Utilities {
	constructor() {
		this.git = new GitUtilities();
		this.fs = new FileSystemUtilities();
		this.path = new PathUtilities();
		this.cmd = new CMDUtilities();
	}

	lazyCatch(callback) {
		try {
			callback();
		}
		catch(e) {}
	}
}

module.exports = new Utilities();