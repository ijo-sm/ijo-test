const FileSystem = require("fs");
const ChildProcess = require("child_process");

module.exports = class GitUtilities {
	gitPull(path, destination, branch = "master") {
		if(!FileSystem.existsSync(destination + "/.git") 
		  || !FileSystem.statSync(destination + "/.git").isDirectory()) {
			this.gitSetup(path, destination);
		}

		Logger.profile("git");

		let git = ChildProcess.spawnSync("git", ["pull", "origin", branch], {cwd: destination});

		if(git.error) {
			return Logger.err("git", `there was an error while pulling ${path}#${branch} (${git.error})`);
		}

		Logger.profile("git", "debug", `pull ${path}#${branch} to ${destination}`);
	}

	gitSetup(path, destination) {
		Logger.profile("git");

		let gitInit = ChildProcess.spawnSync("git", ["init"], {cwd: destination});

		if(gitInit.error) {
			return Logger.err("git", `there was an error while initializing ${destination} (${gitInit.error})`);
		}

		Logger.profile("git", "debug", "init", destination);
		Logger.profile("git");

		let gitRemoteAdd = ChildProcess.spawnSync("git", ["remote", "add", "origin", path], {cwd: destination});

		if(gitRemoteAdd.error) {
			return Logger.err("git", `there was an error while adding the remote origin from ${path} (${gitRemoteAdd.error})`);
		}

		Logger.profile("git", "debug", `remote add origin ${path} to ${destination}`);
	}
}