#!/usr/bin/env node

/*global process*/

var fs = require('fs');
var child_process = require('child_process');
var ionicConfig = "config.xml";
var config = "www/config.xml";
var pgbResources = "www/pgb-resources";
var mkdirp;

// Check if config.xml is there or not
if (!fs.existsSync(ionicConfig)) {
	console.log(ionicConfig + ' not found');
	process.exit(1);
}

// Require and check if mkdirp is there
try {
	mkdirp = require('mkdirp');
} catch (e) {
	console.error(e.message);
	console.error("mkdirp not found. Try running `npm install mkdirp --save`.");
	process.exit(e.code);
}

// Prepare resources folder in www/
if (!fs.existsSync(pgbResources)) {
	fs.mkdirSync(pgbResources);
}

// For some reason android and wp8 directories are not created by mkdirp. So adding them manually.
if (!fs.existsSync(pgbResources + '/ios')) {
	fs.mkdirSync(pgbResources + '/ios');
}
if (!fs.existsSync(pgbResources + '/android')) {
	fs.mkdirSync(pgbResources + '/android');
}
if (!fs.existsSync(pgbResources + '/wp8')) {
	fs.mkdirSync(pgbResources + '/wp8');
}

// Make new config.xml in www/
fs.writeFileSync(config, fs.readFileSync(ionicConfig));
var xml = fs.readFileSync(config, 'utf-8');

// Icons
var iconsRegex = /<icon[^>]+>\n/g,
	icons = xml.match(iconsRegex);
xml = xml.replace(iconsRegex, '');
icons.forEach(function (icon) {
	if (!/gap:platform/.test(icon)) {
		var src = icon.match(/src="[^"]+"/),
			newDirectory,
			newPath;
		src = src[0].replace('src="', '').replace('"', '');

		newPath = src.replace(/^resources/, pgbResources);
		newDirectory = newPath;
		newDirectory = newDirectory.split('/');
		newDirectory.pop();
		newDirectory = newDirectory.join('/');
		mkdirp(newDirectory);

		// Put icon in the new directory
		fs.writeFileSync(newPath, fs.readFileSync(src));

		// Generate icon tags
		var newTag = icon.replace(/src="[^"]+"/, 'src="' + newPath.replace('www/', '') + '" gap:platform="ios"');
		xml = xml.replace("</widget>", "    " + newTag + "</widget>");
	}
});

// Splashes
var splashesRegex = /<splash[^>]+>\n/g,
	splashes = xml.match(splashesRegex);
xml = xml.replace(splashesRegex, '');
splashes.forEach(function (splash) {
	if (!/gap:platform/.test(splash)) {
		var src = splash.match(/src="[^"]+"/),
			newDirectory,
			newPath;
		src = src[0].replace('src="', '').replace('"', '');

		newPath = src.replace(/^resources/, pgbResources);
		newDirectory = newPath;
		newDirectory = newDirectory.split('/');
		newDirectory.pop();
		newDirectory = newDirectory.join('/');

		// Put splash in the new directory
		mkdirp(newDirectory);
		fs.writeFileSync(newPath, fs.readFileSync(src));

		// Generate splash tags
		var newTag = splash.replace('<splash', '<gap:splash').replace(/src="[^"]+"/, 'src="' + newPath.replace('www/', '') + '" gap:platform="ios"');
		xml = xml.replace("</widget>", "    " + newTag + "</widget>");
	}
});

// Remove <platform> tag
xml = xml.replace(/<\/?platform[^>]*>/g, '');

// Add default splash
fs.writeFileSync('www/splash.png', fs.readFileSync('resources/splash.png'));
xml = xml.replace("</widget>", '    <gap:splash src="splash.png" />\n</widget>');

// Trim lines
var lines = xml.split('\n');
lines.forEach(function (line, index, arr) {
	lines[index] = line.replace(/ *$/, '');
});
xml = lines.join('\n');

// Save new www/config.xml
fs.writeFileSync(config, xml);
