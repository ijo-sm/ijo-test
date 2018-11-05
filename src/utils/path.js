module.exports = class PathUtilities {
	match(path, token) {
		if(typeof token === "string") {
			return path.includes(token);
		}
		else if(token instanceof Array) {
			return token.map(token => this.match(path, token)).find(Boolean);
		}
		else if(token instanceof RegExp) {
			return path.match(token);
		}

		return false;
	}

	get() {
		return process.cwd().replace(/\\/g,"/");
	}

	getExactPackageName() {
		let pathArray = this.get().split("/");

		return pathArray[pathArray.length - 1];
	}

	getPackageName() {
		let packageName = this.getExactPackageName();

		if(packageName.startsWith("executor")) {
			packageName = "executor";
		}
		else if(packageName.startsWith("plugin")) {
			packageName = "plugin";
		}

		return packageName;
	}
}
