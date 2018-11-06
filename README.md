# ModpackDL
A simple minecraft modpack downloader.

## Modlist JSON Object
The Modlist JSON object should be a keyed json object with this structure:
~~~~
{
	forgeVersion: 16.45.23282
	mods: {
		{
			id: "ModName"
			version: "1.7.10"
			url: "http://example.org"
		},
		{
			id: "ModName"
			version: "1.12.2"
			url: "http://example.org"
		}
	}
}
~~~~

I suggest using an actual json file or hjson file, instead of writing an object by hand, but you can theorically dynamically generate a modlist.

## Usage
~~~~
var dl = require('modpackdl');
dl.executeDL(modpackJsonObject, modsFolder, forgeVersion)
~~~~
