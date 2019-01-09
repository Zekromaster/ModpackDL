// Copyright (c) 2019 Zekromaster
//
// GNU GENERAL PUBLIC LICENSE
//    Version 3, 29 June 2007
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// Various declarations
import * as fs from 'fs';
import * as path from 'path';
import * as request from 'request';
import * as rmrf from 'rimraf';
import { promisify } from 'es6-promisify';

function generateUrl(url: string | undefined | null): string{
  if (url === undefined || url === null) return "IGNORE";
  return url;
}

class Mod {
  private _name:string;
  private _version:string;
  private _url:string;
  private _directory:string;
  private _downloadedFlag: boolean;

  // A pretty straightforward constructor
  constructor(name:string, version:string, url:string | undefined | null, directory:string){
    this._name = name;
    this._version = version;
    this._url = generateUrl(url);
    this._directory = directory;
    this._downloadedFlag = false;
  }


  // Getters
  get name(): string {
    return this._name;
  }

  get version(): string {
    return this._version;
  }

  get url(): string {
    return this._url;
  }

  get directory(): string{
    return this._directory;
  }

  // A single setter
  set downloadedFlag(downloadedFlag: boolean){
    this._downloadedFlag = downloadedFlag;
  }

  // More complex getters - they expose filename and path
  get filename(): string{
    return this.name + " [" + this.version + "].jar";
  }

  get path():string{
    return this.directory + "/" + this.filename;
  }

  // This downloads the mod
  async download(){

    // If the mod was already downloaded, nothing happenss
    if (this._downloadedFlag) {
      console.log(this.filename + " has already been downloaded. No need to download again.");
      return;
    }

    // Checking if the file must be downloaded or not.
    if (this.url === "IGNORE") {
      console.log(this.filename + " must be supplied by the user");
      return;
    }

    // Executing the download
    console.log(this.filename + " will be downloaded");
    var wsFile: fs.WriteStream = fs.createWriteStream(this.path);
    request(this.url).pipe(wsFile);
    await new Promise(fulfill => wsFile.on("finish", fulfill));

    // Logging the completion of the download
    console.log(this.filename + " has been downloaded!");
  }
}


export async function download(jsModlist:any){
  var marrModlist:Array<Mod> = [];

  var sModFolder: string = jsModlist.directory;

  // If the mod folder does not exist, we create it
  if (!fs.existsSync(sModFolder)){
    await fs.mkdir(
      sModFolder,
      ()=>{
        console.log("Created mod folder")
      }
    );
  }

  // This writes the directory as a list of files
  var sarrDirread:Array<string> = await promisify(fs.readdir)(sModFolder) as Array<string>;

  // This generates an array of "mod" objects
  for (let mod of jsModlist.mods){
    marrModlist.push(
      new Mod(
        mod.name,
        mod.version,
        mod.url,
        sModFolder
      )
    );
  }


  // Deciding what to download - Iterating over the modlist
  for (let mod of marrModlist){
    mod.downloadedFlag = sarrDirread.includes(mod.filename);
  }

  // Deleting removed mods
  for (let file of sarrDirread){
    let bIsContained = false;

    // We iterate over the list of mods searching for the [file]
    for (let mod of marrModlist){
      if (file == mod.filename) bIsContained = true;
    }

    // If [file] is not in the modlist, we remove it
    if (!bIsContained){
      await rmrf(
        sModFolder + "/" + file,
        ()=>{
          console.log(file + " was removed and thus the file is now deleted.")
        }
      );
    }
  }

  // Downloading the missing mods
  for (let mod of marrModlist){
    await mod.download();
  }

  console.log("Remember to use forge " + jsModlist.forgeVersion);
}
