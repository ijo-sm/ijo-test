class Builder {
	async ijo() {
		// Install missing NPM Packages
		await Utils.cmd.forceInstallNPMPackage("sass", {global: true});
		await Utils.cmd.forceInstallNPMPackage("uglifyjs-folder", {global: true});
		
		// Parse all the .scss files
		Utils.cmd.checkForError(await Utils.cmd.execute("sass --no-source-map --style=compressed res\\assets\\scss\\index.scss:res\\assets\\css\\index.css", {cwd: Utils.path.get() + "/test/panel"}));
		Utils.cmd.checkForError(await Utils.cmd.execute("sass --no-source-map --style=compressed res\\assets\\scss\\login.scss:res\\assets\\css\\login.css", {cwd: Utils.path.get() + "/test/panel"}));
		
		// Copy the assets .js files that don't need to be minified
		Utils.fs.copyFolder(Utils.path.get() + "/test/panel/res/assets/src/pages", Utils.path.get() + "/test/panel/res/assets/js");
		Utils.fs.copyFile(Utils.path.get() + "/test/panel/res/assets/src/jquery.min.js", Utils.path.get() + "/test/panel/res/assets/js/jquery.min.js");
		
		// Minify all the assets panel .js files
		Utils.cmd.checkForError(await Utils.cmd.execute("uglifyjs-folder -y -o res\\assets\\js\\panel.min.js -- res\\assets\\src\\panel\\", {cwd: Utils.path.get() + "/test/panel"}));
	}
}

module.exports = new Builder();