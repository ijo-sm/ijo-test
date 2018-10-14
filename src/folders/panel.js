const Utils = require("./../utils");
const Builder = require("./../builder");
const Installer = require("./../installer");
const PluginsFolder = require("./plugins");

module.exports = class PanelFolder {
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