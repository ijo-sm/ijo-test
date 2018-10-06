const FileSystem = require("fs");
const Util = require('util');
const ChildProcess = require("child_process");
const exec = Util.promisify(ChildProcess.exec);

class Utils {
	checkForError(response) {
		if(response.stderr !== "" && !response.stderr.startsWith("npm WARN")) {
			throw new Error(response.stderr);
		}
	}

	copyFile(origin, destination) {
		Logger.profile("fs");
		FileSystem.copyFileSync(origin, destination);
		Logger.profile("fs", "debug", "copy", origin, "to", destination);
	}

	prefixLines(data, prefix) {
		let lines = data.split("\n");

		for(var i = 0; i < lines.length; i++) {
			if(lines[i] === "") {
				continue;
			}

			lines[i] = prefix + lines[i];
		}

		return lines.join("\n");
	}

	copyFolder(origin, destination) {
		let files = FileSystem.readdirSync(origin);

		for(var i = 0; i < files.length; i++) {
			this.copyFile(origin + "/" + files[i], destination + "/" + files[i]);
		}
	}

	copyFolderRecursively(origin, destination, options = {}) {
		let files = FileSystem.readdirSync(origin);

		for(var i = 0; i < files.length; i++) {
			let isDirectory = FileSystem.statSync(origin + "/" + files[i]).isDirectory();

			if(isDirectory && !this.matchPath(origin + "/" + files[i] + "/", options["exclude"])) {
				this.mkdir(destination + "/" + files[i]);
				this.copyFolderRecursively(origin + "/" + files[i], destination + "/" + files[i], options);
			}
			else if(!isDirectory && !this.matchPath(origin + "/" + files[i], options["exclude"])) {
				this.copyFile(origin + "/" + files[i], destination + "/" + files[i]);
			}
		}
	}

	async execute(command, options = {}) {
		Logger.profile("cmd");
		var response = await exec(command, options);
		Logger.profile("cmd", "debug", "execute", "\"" + command + "\"", "in", options.cwd || this.path());

		return response;
	}

	async forceInstallNPMPackage(packageName, options = {}) {
		if(!await this.tryCommand(packageName)) {
			Logger.profile("npm");
			this.checkForError(await this.execute("npm install " + packageName + (options.global ? " -g" : ""), {cwd: options.cwd}));
			Logger.profile("npm", "debug", "install", packageName, options);
		}
	}

	getExactPackageName() {
		let pathArray = this.path().split("/");

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

	gitPull(path, destination, branch = "master") {
		if(!FileSystem.existsSync(destination + "/.git") || !FileSystem.statSync(destination + "/.git").isDirectory()) {
			this.gitSetup(path, destination);
		}

		Logger.profile("git");
		let git = ChildProcess.spawnSync("git", ["pull", "origin", branch], {cwd: destination});

		if(git.error) {
			return Logger.err("git", "there was an error while pulling", path + "#" + branch, "(" + git.error + ")");
		}

		Logger.profile("git", "debug", "pull", path + "#" + branch, "to", destination);
	}

	gitSetup(path, destination) {
		Logger.profile("git");
		let gitInit = ChildProcess.spawnSync("git", ["init"], {cwd: destination});

		if(gitInit.error) {
			return Logger.err("git", "there was an error while initializing", destination, "(" + gitInit.error + ")");
		}

		Logger.profile("git", "debug", "init", destination);

		Logger.profile("git");
		let gitRemoteAdd = ChildProcess.spawnSync("git", ["remote", "add", "origin", path], {cwd: destination});

		if(gitRemoteAdd.error) {
			return Logger.err("git", "there was an error while adding the remote origin from", path, "(" + gitRemoteAdd.error + ")");
		}

		Logger.profile("git", "debug", "remote add origin", path, "to", destination);
	}

	async install(config, destination) {
		switch(config.type) {
			case "fs":
				this.copyFolderRecursively(config.path, destination, {exclude: ["/.git/", "/test/", "/node_modules/"]});
				break;

			case "git":
			default:
				this.gitPull(config.path, destination, config.branch);
				break;
		}
	}

	lazyCatch(callback) {
		try {
			callback();
		}
		catch(e) {}
	}

	matchPath(path, token) {
		if(typeof token === "string") {
			return path.includes(token);
		}
		else if(token instanceof Array) {
			return token.map(token => this.matchPath(path, token)).find(Boolean);
		}
		else if(token instanceof RegExp) {
			return path.match(token);
		}

		return false;
	}

	mkdir(path) {
		Logger.profile("fs");
		this.lazyCatch(() => FileSystem.mkdirSync(path));
		Logger.profile("fs", "mkdir", path);
	}

	path() {
		return process.cwd().replace(/\\/g,"/");
	}
	
	async tryCommand(command) {
		try {
			await this.execute("where " + command);
		}
		catch(e) {
			return false;
		}
	
		return true;
	}
}

module.exports = new Utils();