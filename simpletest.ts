import * as dl from "./index";

dl.executeDL(require('../testmodlist.json'), "./mods").then(function () {console.log("Everything went well")}).catch(function () {console.log("There was an error")})
