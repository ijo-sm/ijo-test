const Utils = require("./utils");

module.exports = class TestConfig {
	load() {
		let defaults = require("./../res/defaults/config.json");

		Utils.lazyCatch(() => this.config = require(Utils.path() + "/test.json"));

		if(this.config === undefined) {
			this.config = {};
		}

		return this.config = Object.assign({}, this.config, defaults, this.config);
	}
}