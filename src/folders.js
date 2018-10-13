const Utils = require("./utils");
const Builder = require("./builder");
const Installer = require("./installer");
const FileSystem = require("fs");

class PanelFolder {
	constructor(config) {
		this.config = config;
	}

	async create() {
		this.createFolder();
		await this.createFolders();
		await this.installPanel();
		await this.installPackages();
	}

	createFolder() {
		Utils.mkdir(Utils.path() + "/test/panel");
	}

	async createFolders() {
		Logger.info("PluginsFolder", "creating");
		Logger.profile("PluginsFolder");
		await new PluginsFolder(this.config, "panel").create();
		Logger.profile("PluginsFolder", "info", "creating finished");
	}

	async installPanel() {
		Logger.info("ijo", "installing");
		Logger.profile("ijo");
		await Installer.ijo(this.config);
		Logger.profile("ijo", "info", "installing finished");

		Logger.info("ijo", "building");
		Logger.profile("ijo");
		await Builder.ijo(this.config);
		Logger.profile("ijo", "info", "building finished");
	}

	async installPackages() {
		await Utils.forceInstallNPMPackage("", {cwd: Utils.path() + "/test/panel"});
	}
}

class PluginsFolder {
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

module.exports = class TestFolder {
	constructor(config) {
		this.config = config;
	}

	async create() {
		this.createFolder();
		this.cleanupFiles();
		await this.createFolders();
	}

	createFolder() {
		Utils.mkdir(Utils.path() + "/test");
	}

	cleanupFiles() {
		if(!this.config.save_panel_config) {
			Utils.lazyCatch(() => FileSystem.unlinkSync(Utils.path() + "/test/panel.json"));
		}
	}

	async createFolders() {
		Logger.info("PanelFolder", "creating");
		Logger.profile("PanelFolder");
		await new PanelFolder(this.config).create();
		Logger.profile("PanelFolder", "info", "creating finished");

		Utils.mkdir(Utils.path() + "/test/data");
	}
}