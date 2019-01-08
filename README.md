# ModpackDL
A simple minecraft modpack downloader.

## Modlist JSON Object
The Modlist JSON object should be a keyed json object with this structure:
~~~~
{
	directory: "./myModFolder",
	forgeVersion: "16.45.23282"
	mods: [
		{
			name: "ModName"
			version: "1.7.10"
			url: "http://example.org"
		},
		{
			name: "ModName"
			version: "1.12.2"
			url: "http://example.org"
		}
	]
}
~~~~

I suggest using an actual json file or hjson file, instead of writing an object by hand, but you can theorically dynamically generate a modlist.  
"IGNORE" can be used as an url to have mods that must be added manually (for licensing needs or because the mod itself is not published online). You can also avoid specifying an url entirely.

## Usage
~~~~
var dl = require('modpackdl');
dl.download(modpackJsonObject)
~~~~

or

~~~~
var dl = require('modpackdl');
dl.download(modpackJsonObject).then( function(){
	//Your stuff
}.catch(function(){
	//Error handling
})
~~~~

executeDL() is async, not for lack of trying to download things in a synchronous manner.
