
import * as uzacommon from 'uzalu_common';
uzacommon.globalise(uzacommon,global);

import runTests from './tests.js';
import EventsCore from './events.js';

class AssetsCore extends EventEmitter {
	constructor(){
		super();
		this.events = new EventsCore(this);
	}
	async tests(){
		await runTests();
	}
}

var core = new AssetsCore();
export default core;

// remove when published
core.tests();
