"use strict";
/* This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details. */
exports.__esModule = true;
// Config
require("hjson/lib/require-config");
// Various declarations
var fs = require('fs');
var downloadfile = require('download-to-file');
var modlist = [];
var finalModlist = [];
var modDir = "./mods";
var Mod = /** @class */ (function () {
    function Mod(name, version, url, directory) {
        this.name = name;
        this.version = version;
        this.url = url;
        this.directory = directory;
    }
    Mod.prototype.getFilename = function () {
        return this.name + " [" + this.version + "].jar";
    };
    Mod.prototype.getPath = function () {
        return this.directory + "/" + this.getFilename();
    };
    Mod.prototype.download = function () {
        if (this.url == "IGNORE") {
            console.log(this.getFilename() + " must be supplied by the user");
            return;
        }
        console.log(this.getFilename() + " will be downloaded");
        downloadfile(this.url, this.getPath(), function (err, filepath) {
            if (err)
                throw err;
            console.log('Download finished:' + filepath);
        });
    };
    return Mod;
}());
function executeDL(modlistJSONObject, modFolder, forgeVersion) {
    if (!fs.existsSync(modFolder)) {
        fs.mkdirSync(modFolder);
    }
    var dirread = fs.readdirSync(modFolder);
    for (var modname in modlistJSONObject) {
        modlist.push(new Mod(modname, modlistJSONObject[modname].version, modlistJSONObject[modname].url, modFolder));
    }
    // Deciding what to download
    for (var mod in modlist) {
        if (!(dirread.includes(modlist[mod].getFilename()))) {
            finalModlist.push(modlist[mod]);
        }
        else {
            console.log(modlist[mod].getFilename() + " has already been downloaded. No need to download again.");
        }
    }
    // Deleting all existing files
    for (var file in dirread) {
        var isContained = false;
        for (var mod in modlist) {
            if (dirread[file] == modlist[mod].getFilename())
                isContained = true;
        }
        if (!isContained) {
            fs.unlinkSync(modDir + "/" + dirread[file]);
            console.log(dirread[file] + " was removed and thus the file is now deleted.");
        }
    }
    // Downloading missing mods
    for (var mod in finalModlist) {
        finalModlist[mod].download();
    }
    console.log("Remember to use forge " + forgeVersion);
}
exports.executeDL = executeDL;
