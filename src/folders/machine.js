const Installer = require("./../installer");

module.exports = class PanelFolder {
	constructor(config) {
		this.config = config;
	}

	async create() {
		this.createFolder();
		
		await this.installMachine();
	}

	createFolder() {
		Utils.fs.mkdir(Utils.path.get() + "/test/machine");
	}

	async installMachine() {
		Logger.info("machine", "installing");
		Logger.profile("machine");

		await Installer.machine(this.config);

		Logger.profile("machine", "info", "installing finished");
	}
}