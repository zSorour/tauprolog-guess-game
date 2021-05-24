const pl = require('tau-prolog');
const jsModuleLoader = require('tau-prolog/modules/js');
const promisesModuleLoader = require('tau-prolog/modules/promises');


jsModuleLoader(pl);
promisesModuleLoader(pl);

let session = pl.create();

export default session;