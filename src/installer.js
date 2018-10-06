const Utils = require("./utils");

class Installer {
	async ijo(config) {
		if(typeof config.ijo !== "object") {
			config.ijo = {
				type: "git",
				path: "https://github.com/ijo-sm/ijo.git",
				branch: "dev",
				ignore_self: false
			}
		}

		if(Utils.getExactPackageName() === "ijo" && !config.ijo.ignore_self) {
			config.ijo.type = "fs";
			config.ijo.path = Utils.path();
		}

		await Utils.install(config.ijo, Utils.path() + "/test/panel");
	}

	async plugin(config, name, location) {
		if(Utils.getExactPackageName() === name && !config.ignore_self) {
			config.type = "fs";
			config.path = Utils.path();
		}

		Utils.mkdir(Utils.path() + "/test/" + location + "/executors/" + name);

		await Utils.install(config, Utils.path() + "/test/" + location + "/plugins/" + name);
	}

	async executor(config, name, location) {
		if(Utils.getExactPackageName() === name && !config.ignore_self) {
			config.type = "fs";
			config.path = Utils.path();
		}

		Utils.mkdir(Utils.path() + "/test/" + location + "/executors/" + name);

		await Utils.install(config, Utils.path() + "/test/" + location + "/executors/" + name);
	}
}

module.exports = new Installer();