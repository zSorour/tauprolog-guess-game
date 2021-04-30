const pl = require('tau-prolog');
const loader = require('tau-prolog/modules/js');

loader(pl);

let session = pl.create();

export default session;