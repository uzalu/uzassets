
import { Property } from './property.js';
import { isNumeric, removeFromArray } from 'uzalu_common';

export class Holder {
	constructor(){
		this._holdings = [];
	}
	get holdings(){ return this._holdings; }
	holding(property,count){
		// if using count, only return the holding if its count is high enough.
		if(property instanceof Holding){
			property = property.property;
		}
		var holding;
		for(var held of Object.values(this.holdings)){
			if(held.property.sameAs(property)){
				if(count === undefined || held.count >= count){
					return held;
				}
				break;
			}
		}
	}
	addHolding(holding){
		assert(holding instanceof Holding);
		if(holding.assigned){
			throw new HoldingAlreadyAssignedError(holding);
		}
		if(this.holding(holding)){
			this.holding(holding).combine(holding);
		} else {
			holding.assign(this);
			this._holdings.push(holding);
		}
	}
	removeHolding(holding){
		assert(holding instanceof Holding);
		var held = this.holding(holding);
		if(held && held.count >= holding.count){
			if(held.count == holding.count){
				removeFromArray(this._holdings,held);
				holding.unassign();
			} else {
				held.count -= holding.count;
			}
		} else {
			throw new InsufficientSupplyError(this,holding);
		}
	}
	
	canExchange(otherHolder,holdingsIn,holdingsOut,throwSupplyError = false){
		if(!(otherHolder instanceof Holder)){ return false; }
		if(holdingsIn === undefined){ holdingsIn = []; }
		if(holdingsOut === undefined){ holdingsOut = []; }
		for(var holdingIn of holdingsIn){
			if(!otherHolder.holding(holdingIn,holdingIn.count)){
				if(throwSupplyError){
					throw new InsufficientSupplyError(otherHolder,holdingIn);
				} else {
					return false;
				}
			}
		}
		for(var holdingOut of holdingsOut){
			if(!this.holding(holdingOut,holdingOut.count)){
				if(throwSupplyError){
					throw new InsufficientSupplyError(this,holdingOut);
				} else {
					return false;
				}
			}
		}
		return true;
	}
	exchange(otherHolder,holdingsIn,holdingsOut){
		assert(otherHolder instanceof Holder);
		if(holdingsIn instanceof Holding){ holdingsIn = [holdingsIn]; }
		if(holdingsOut instanceof Holding){ holdingsOut = [holdingsOut]; }
		if(holdingsIn === undefined){ holdingsIn = []; }
		if(holdingsOut === undefined){ holdingsOut = []; }
		this.canExchange(otherHolder,holdingsIn,holdingsOut,true);
		for(var holdingIn of holdingsIn){
			otherHolder.removeHolding(holdingIn);
			this.addHolding(holdingIn);
		}
		for(var holdingOut of holdingsOut){
			this.removeHolding(holdingOut);
			otherHolder.addHolding(holdingOut);
		}
		return true;
	}
}
export class Holding {
	constructor(property,count){
		assert(property instanceof Property);
		this.property = property;
		this.count = count;
	}
	get count(){ return +this._count; }
	set count(count){
		if(count === undefined){ count = 1; }
		assert(isNumeric(count));
		assert(count > 0);
		this._count = +count;
	}
	
	get name(){ return this.property.name; }
	get title(){ return this.property.title; }
	get author(){ return this.property.author; }
	get created(){ return this.property.created; }
	samePropertyAs(holding){
		return this.property.sameAs(holding.property);
	}
	assign(holder){
		assert(holder instanceof Holder);
		this.holder = holder;
	}
	unassign(){
		this.holder = undefined;
	}
	get assigned(){
		return this.holder !== undefined;
	}
	canCombine(holding){
		if(!this.samePropertyAs(holding)){ return false; }
		return true;
	}
	combine(holding){
		if(!this.canCombine(holding)){
			throw new IncompatibleHoldingsError(this,holding);
		}
		this.count += holding.count;
	}
}

export class IncompatibleHoldingsError extends Error {
	constructor(holding1,holding2){
		super();
		this.holding1 = holding1;
		this.holding2 = holding2;
	}
}
export class InsufficientSupplyError extends Error {
	constructor(holder,holdingRequested){
		super();
		this.holder = holder;
		this.holdingAvailable = holder.holding(holdingRequested);
		this.holdingRequested = holdingRequested;
	}
}
export class HoldingAlreadyAssignedError extends Error {
	constructor(holding){
		super();
		this.holding = holding;
	}
}
