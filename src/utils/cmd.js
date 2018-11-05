const ChildProcess = require("child_process");
const exec = require('util').promisify(ChildProcess.exec);

module.exports = class CMDUtilities {
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

		let response = await exec(command, options);

		Logger.profile("cmd", "debug", `execute \"${command}\" in ${options.cwd || Utils.path.get()}`, );

		return response;
	}

	async forceInstallNPMPackage(packageName, options = {}) {
		if(!await this.tryCommand(packageName)) {
			Logger.profile("npm");

			this.checkForError(
			  await this.execute(`npm install ${packageName}${options.global ? " -g" : ""}`, {cwd: options.cwd})
			);

			Logger.profile("npm", "debug", "install", packageName, options);
		}
	}

	checkForError(response) {
		if(response.stderr !== "" && !response.stderr.startsWith("npm WARN")) {
			throw new Error(response.stderr);
		}
	}
}
