
import { Property } from './property.js';

export default class PropertyEffect {
	constructor(title){
		abstractClass(this,PropertyEffect);
	}
}

export class PropertyCopyrightEffect extends PropertyEffect {
	constructor(property){
		super('copyright');
		assert(property instanceof Property);
		this.property = property;
	}
	providesCopyrightFor(property){
		return this.property.sameAs(property);
	}
}
