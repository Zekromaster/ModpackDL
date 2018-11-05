/* This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details. */

// Various declarations
require("hjson/lib/require-config");
var fs = require('fs');
var modlist:Array<Mod> = [];
var wait = require('wait.for-es6');
var finalModlist:Array<Mod> = [];
var modDir = "./mods";
var rmrf = require('rimraf').sync;
var request = require('request');

class Mod {
  name:string;
  version:string;
  url:string;
  directory:string;
  constructor(name:string, version:string, url:string, directory:string){
    this.name = name;
    this.version = version;
    this.url = url;
    this.directory = directory;
  }
  getFilename():string{
    return this.name + " [" + this.version + "].jar";
  }
  getPath():string{
    return this.directory + "/" + this.getFilename();
  }
  download():void{
    if (this.url == "IGNORE") {
      console.log(this.getFilename() + " must be supplied by the user");
      return;
    }
    console.log(this.getFilename() + " will be downloaded");
    var file = fs.createWriteStream(this.getPath());
    wait.for(request(this.url).pipe(file));
    console.log(this.getFilename() + " has been downloaded!");
  }
}


export function executeDL(modlistJSONObject:any, modFolder:string, forgeVersion:string):void{
  if (!fs.existsSync(modFolder)){
    fs.mkdirSync(modFolder);
  }

  var dirread:Array<string> = fs.readdirSync(modFolder);
  for (let modname in modlistJSONObject){
    modlist.push(new Mod(modname, modlistJSONObject[modname].version, modlistJSONObject[modname].url, modFolder));
  }


  // Deciding what to download
  for (let mod in modlist){
    if (!(dirread.includes(modlist[mod].getFilename()))){
      finalModlist.push(modlist[mod]);
    }else{
      console.log(modlist[mod].getFilename() + " has already been downloaded. No need to download again.")
    }
  }

  // Deleting all existing files
  for (let file in dirread){
    var isContained = false;
    for (let mod in modlist){
      if (dirread[file] == modlist[mod].getFilename()) isContained = true;
    }
    if (!isContained){
      rmrf(modDir + "/" + dirread[file]);
      console.log(dirread[file] + " was removed and thus the file is now deleted.")
    }
  }

  // Downloading missing mods
  for (let mod in finalModlist){
    finalModlist[mod].download();
  }

  console.log("Remember to use forge " + forgeVersion);
}

executeDL(require('../modlist.hjson'), "./mods", "3");
console.log("Prova");
