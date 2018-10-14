const FileSystem = require("fs");
const PanelFolder = require("./panel");

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
		Utils.fs.mkdir(Utils.path.get() + "/test");
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

		Utils.fs.mkdir(Utils.path.get() + "/test/data");
	}
}