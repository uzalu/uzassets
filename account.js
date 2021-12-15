
import { Property } from './property.js';
import { Holder } from './holdings.js';

class Toiler {
	constructor(){
		this._toil = 0;
	}
	get toil(){ return this._toil; }
	addToil(amount){
		amount = +amount;
		this._toil += amount;
	}
	subToil(amount){
		amount = +amount;
		this._toil -= amount;
	}
}

export class Account extends mixins(Holder,Toiler) {
	constructor(id){
		super();
		this.id = id;
	}
}
