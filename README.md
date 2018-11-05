# ModpackDL
A simple minecraft modpack downloader.

## Modlist JSON Object
The Modlist JSON object should be a keyed json object with this structure:
~~~~
{
	ModA: {
		version: 1.2.5,
		url: "http://example.org"
	},
	ModB: {
		version: 1.4.7,
		url: "http://github.com"
	}
}
~~~~

I suggest using an actual json file or hjson file, instead of writing an object by hand.

## Usage
~~~~ var dl = require('modpackdl');
dl.executeDL(modpackJsonObject, modsFolder, forgeVersion) ~~~~
