
import PropertyEffect from './property-effects.js';
import PropertyContent from './property-content.js';
export * from './property-effects.js';
export * from './property-content.js';

var allowedChars = 'abcdefghijklmnopqrstuvwxyz_';
var uzassetsEpoch = 1638748800 * 1e3;
var enumerator = Math.floor(Math.random() * 1e3);
function canonName(title,created){
	if(created === undefined){
		created = Date.now();
	}
	created = parseInt(created);
	var num = String(Math.floor((created - uzassetsEpoch) / 1e3)) + enumerator;
	enumerator++;
	var text = '';
	for(var i = 0; i < title.length; i++){
		var c = title[i];
		var cl = c.toLowerCase();
		if(c == ' '){
			text += '_';
		} else if(allowedChars.includes(cl)){
			text += cl;
		}
	}
	text = text.replace(/_+/,'_').replace(/^_+|_+$/,'');
	return text+':'+num;
}

export class PropertyManager {
	constructor(){
		this.properties = {};
	}
	get(name){ return this.properties[name]; }
	has(name){ return this.get(name) !== undefined; }
	submit(property){
		assert(property instanceof Property);
		assert(!this.has(property));
		this.properties[property.name] = property;
	}
}

export class Property {
	constructor(title,author){
		this.title = title;
		this.author = author;
		this.created = nanodec();
		this.name = canonName(this.title,this.created);
		this._published = false;
		this._effects = [];
		this._contents = [];
	}
	sameAs(property){
		if(!(property instanceof Property)){ return false; }
		return property.name == this.name &&
		property.author == this.author &&
		property.created == this.created;
	}
	
	get effects(){
		return [...this._effects];
	}
	set effects(effects){
		for(var effect of effects){
			assert(effect instanceof PropertyEffect);
		}
		this._effects = effects;
	}
	
	get contents(){
		return [...this._contents];
	}
	set contents(contents){
		for(var content of contents){
			assert(content instanceof PropertyContent);
		}
		this._contents = contents;
	}
	get content(){
		if(this._contents.length == 0){
			return undefined;
		} else {
			return this._contents[0];
		}
	}
	
	get published(){
		return Boolean(this._published);
	}
	publish(tradename){
		this._published = true;
		implement('publish');
	}
}
