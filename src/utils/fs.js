const FileSystem = require("fs");

module.exports = class FileSystemUtilities {
	copyFile(origin, destination) {
		Logger.profile("fs");
	
		FileSystem.copyFileSync(origin, destination);

		Logger.profile("fs", "debug", "copy", origin, "to", destination);
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

			if(isDirectory && !Utils.path.match(origin + "/" + files[i] + "/", options["exclude"])) {
				this.mkdir(destination + "/" + files[i]);
				this.copyFolderRecursively(origin + "/" + files[i], destination + "/" + files[i], options);
			}
			else if(!isDirectory && !Utils.path.match(origin + "/" + files[i], options["exclude"])) {
				this.copyFile(origin + "/" + files[i], destination + "/" + files[i]);
			}
		}
	}

	mkdir(path) {
		Logger.profile("fs");

		Utils.lazyCatch(() => FileSystem.mkdirSync(path));

		Logger.profile("fs", "mkdir", path);
	}
}