const Installer = require("./../installer");
const PluginsFolder = require("./plugins");

module.exports = class MachineFolder {
	constructor(config) {
		this.config = config;
	}

	async create() {
		this.createFolder();
		
		await this.createFolders();
		await this.installMachine();
		await this.installPackages();
	}

	createFolder() {
		Utils.fs.mkdir(`${Utils.path.get()}/test/machine`);
	}

	async createFolders() {
		Logger.info("PluginsFolder", "creating");
		Logger.profile("PluginsFolder");

		await new PluginsFolder(this.config, "machine").create();

		Logger.profile("PluginsFolder", "info", "creating finished");
	}

	async installMachine() {
		Logger.info("machine", "installing");
		Logger.profile("machine");

		await Installer.machine(this.config);

		Logger.profile("machine", "info", "installing finished");
	}

	async installPackages() {
		await Utils.cmd.forceInstallNPMPackage("", {cwd: `${Utils.path.get()}/test/machine`});
	}
}