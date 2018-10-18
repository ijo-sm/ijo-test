const TestFolder = require("./folders/test");
const Fork = require("./fork");
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

		this.ijo = new Fork(this.config, {
			path: "panel/index",
			name: "panel",
			prefix: "p: ",
			keepAlive: this.config.ijo.keep_alive
		});
		this.ijo.start();

		if(this.config.machine) {
			Logger.info("machine", "starting");
			this.machine = new Fork(this.config, {
				path: "machine/index",
				name: "machine",
				prefix: "m: ",
				keepAlive: this.config.machine.keep_alive
			});
			this.machine.start();
		}
	}
}