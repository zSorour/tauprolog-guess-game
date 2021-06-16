//Importing tau-prolog package and its required modules
const pl = require('tau-prolog');
const jsModuleLoader = require('tau-prolog/modules/js');
const promisesModuleLoader = require('tau-prolog/modules/promises');

//Load the JS and Promises Interface modules on the pl tauprolog object.
jsModuleLoader(pl);
promisesModuleLoader(pl);

//Create a prolog knowledge base session
let session = pl.create();

//export the session
export default session;