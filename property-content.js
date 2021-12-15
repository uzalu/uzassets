
import { Property } from './property.js';

export default class PropertyContent {
	constructor(){
		abstractClass(this,PropertyContent);
	}
	get asString(){ implement('asString'); }
}

export class PropertyTextContent extends PropertyContent {
	constructor(text){
		super();
		this.text = text;
	}
	get asString(){ return this.text; }
	get length(){ return this.text.length; }
}
// TODO media (image, video, etc., maybe all seperate), html, url 
