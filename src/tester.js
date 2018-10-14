const TestFolder = require("./folders/test");
const IJO = require("./ijo");
const TestConfig = require("./config");

module.exports = class Tester {
	async run() {
		this.config = new TestConfig().load();

		Logger.level = this.config.logging_level;

		Logger.info("test", "starting");
		Logger.profile("test");

		Logger.debug("config", this.config);

		Logger.info("TestFolder", "creating");
		Logger.profile("TestFolder");
		await new TestFolder(this.config).create();
		Logger.profile("TestFolder", "info", "creating finished");

		Logger.info("ijo", "starting");

		this.ijo = new IJO(this.config);
		this.ijo.start();
	}
}