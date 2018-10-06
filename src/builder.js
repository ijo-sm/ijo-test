const Utils = require("./utils");

class Builder {
	async ijo() {
		// Install missing NPM Packages
		await Utils.forceInstallNPMPackage("sass", {global: true});
		await Utils.forceInstallNPMPackage("uglifyjs-folder", {global: true});
		
		// Parse all the .scss files
		Utils.checkForError(await Utils.execute("sass --no-source-map --style=compressed res\\assets\\scss\\index.scss:res\\assets\\css\\index.css", {cwd: Utils.path() + "/test/panel"}));
		Utils.checkForError(await Utils.execute("sass --no-source-map --style=compressed res\\assets\\scss\\login.scss:res\\assets\\css\\login.css", {cwd: Utils.path() + "/test/panel"}));
		
		// Copy the assets .js files that don't need to be minified
		Utils.copyFolder(Utils.path() + "/test/panel/res/assets/src/pages", Utils.path() + "/test/panel/res/assets/js");
		Utils.copyFile(Utils.path() + "/test/panel/res/assets/src/jquery.min.js", Utils.path() + "/test/panel/res/assets/js/jquery.min.js");
		
		// Minify all the assets panel .js files
		Utils.checkForError(await Utils.execute("uglifyjs-folder -y -o res\\assets\\js\\panel.min.js -- res\\assets\\src\\panel\\", {cwd: Utils.path() + "/test/panel"}));
	}
}

module.exports = new Builder();