const Utils = require("./../utils");
const Installer = require("./../installer");

module.exports = class PluginsFolder {
	constructor(config, path) {
		this.config = config;
		this.path = path;
	}

	async create() {
		this.createFolder();
		await this.installPlugins();
	}

	createFolder() {
		Utils.mkdir(Utils.path() + "/test/" + this.path + "/plugins");
	}

	async installPlugins() {
		let plugins = this.config.plugins;

		if(typeof plugins !== "object") {
			if(Utils.getPackageName() !== "plugin") {
				return;
			}

			plugins = {};
			plugins[Utils.getExactPackageName()] = {};
		}

		if(Utils.getPackageName() === "plugin" && plugins[Utils.getExactPackageName()] === undefined) {
			plugins[Utils.getExactPackageName()] = {};
		}

		for(let name in plugins) {
			if(typeof plugins[name] === "object") {
				Logger.info("plugin", "installing", name);
				Logger.profile("plugin");
				await Installer.plugin(plugins[name], name, this.path);
				Logger.profile("plugin", "info", "installing finished", name);
			}
		}
	}
}