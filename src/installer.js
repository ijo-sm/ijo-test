async function install(config, destination) {
	switch(config.type) {
		case "fs":
			Utils.fs.copyFolderRecursively(
			  config.path, destination, 
			  {exclude: ["/.git/", "/test/", "/node_modules/"]
			});
			break;

		case "git":
		default:
			Utils.git.gitPull(config.path, destination, config.branch);
			break;
	}
}

class Installer {
	async panel(config) {
		if(typeof config.ijo !== "object") {
			config.ijo = {
				type: "git",
				path: "https://github.com/ijo-sm/ijo.git",
				branch: "dev",
				ignore_self: false
			}
		}

		if(Utils.path.getExactPackageName() === "ijo" && !config.ijo.ignore_self) {
			config.ijo.type = "fs";
			config.ijo.path = Utils.path.get();
		}

		await install(config.ijo, `${Utils.path.get()}/test/panel`);
	}

	async machine(config) {
		if(typeof config.machine !== "object") {
			config.machine = {
				type: "git",
				path: "https://github.com/ijo-sm/ijo-machine.git",
				branch: "dev",
				ignore_self: false
			}
		}

		if(Utils.path.getExactPackageName() === "ijo-machine" && !config.machine.ignore_self) {
			config.machine.type = "fs";
			config.machine.path = Utils.path.get();
		}

		await install(config.machine, `${Utils.path.get()}/test/machine`);
	}

	async plugin(config, name, location) {
		if(Utils.path.getExactPackageName() === name && !config.ignore_self) {
			config.type = "fs";
			config.path = Utils.path.get();
		}

		Utils.fs.mkdir(`${Utils.path.get()}/test/${location}/plugins/${name}`);

		await install(config, `${Utils.path.get()}/test/${location}/plugins/${name}`);
	}
}

module.exports = new Installer();