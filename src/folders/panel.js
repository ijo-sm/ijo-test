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
		Utils.fs.mkdir(`${Utils.path.get()}/test/panel`);
	}

	async createFolders() {
		Logger.info("PluginsFolder", "creating");
		Logger.profile("PluginsFolder");

		await new PluginsFolder(this.config, "panel").create();

		Logger.profile("PluginsFolder", "info", "creating finished");
	}

	async installPanel() {
		Logger.info("panel", "installing");
		Logger.profile("panel");

		await Installer.panel(this.config);

		Logger.profile("panel", "info", "installing finished");
		Logger.info("panel", "building");
		Logger.profile("panel");

		await Builder.panel(this.config);

		Logger.profile("panel", "info", "building finished");
	}

	async installPackages() {
		await Utils.cmd.forceInstallNPMPackage("", {cwd: `${Utils.path.get()}/test/panel`});
	}
}