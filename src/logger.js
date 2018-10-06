let levelNumbers = {
	"err": 0,
	"warn": 1,
	"info": 2,
	"debug": 3
}

module.exports = class Logger {
	constructor(level) {
		this.profiles = {};
		this.level = level;
	}

	matchLevel(level) {
		let masterLevelNumber = levelNumbers[this.level];
		let slaveLevelNumber = levelNumbers[level];

		return masterLevelNumber >= slaveLevelNumber;
	}
	
	log(level, name, ...messages) {
		if(!this.matchLevel(level)) {
			return;
		}

		console.log("[" + level + "] " + name + " -", ...messages);
	}

	err(name, ...messages) {
		this.log("err", name, ...messages);
	}

	info(name, ...messages) {
		this.log("info", name, ...messages);
	}

	warn(name, ...messages) {
		this.log("warn", name, ...messages);
	}

	debug(name, ...messages) {
		this.log("debug", name, ...messages);
	}

	profile(name, level, ...messages) {
		if(messages.length === 0 || this.profiles[name] === undefined) {
			this.profiles[name] = new Date().getTime();
		}
		else {
			messages.push((new Date().getTime() - this.profiles[name]) + "ms");

			this.log(level, name, ...messages);
		}
	}
}