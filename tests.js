 
import { Property } from './property.js';
import { Account } from './account.js';
import { Holding, Holder, InsufficientSupplyError, HoldingAlreadyAssignedError } from './holdings.js';
import { test, tests } from 'uzalu_common';

export default async function runTests(){
	
	tests(
		'property name 1',tm => {
			var jd = new Property('Jack\'s Dignity ;)');
			assert(jd.name.match(/jacks_dignity:\d+/));
			return jd.name;
		},
		'property name 2',tm => {
			var jd = new Property('Jack\'s Dignity 2 ;)');
			assert(jd.name.match(/jacks_dignity:\d+/));
			return jd.name;
		},
		'account create',tm => {
			var acctId = '263441922331246603'; // my discord
			var account = new Account(acctId);
			assert(account.id == acctId);
			return account.id;
		},
		'toil add',tm => {
			var account = new Account('acctowner');
			var amount = Math.floor(Math.random() * 1e4);
			account.addToil(amount);
			assert(account.toil == amount);
			return account.toil;
		},
		'toil add then sub',() => {
			var account = new Account('acctowner');
			var amount = Math.floor(Math.random() * 1e4);
			var amount2 = Math.min(amount - 10,Math.floor(Math.random() * 1e4));
			account.addToil(amount);
			account.subToil(amount2);
			assert(account.toil == amount - amount2);
			return account.toil;
		},
		'property is same',() => {
			var prop1 = new Property('test prop 1');
			return prop1.sameAs(prop1);
		},
		'property is different',() => {
			var prop1 = new Property('test prop 1');
			var prop2 = new Property('test prop 2');
			return !(prop1.sameAs(prop2));
		},
		'holding is added',tm => {
			var account = new Account('owner');
			assert(account instanceof Holder);
			var property = new Property('test prop 1','uzalu');
			var holding = new Holding(property,10);
			account.addHolding(holding);
			assert(account.holding(holding).count == 10);
		},
		'holding is added, combined',tm => {
			var account = new Account('owner');
			assert(account instanceof Holder);
			var property = new Property('test prop 1','uzalu');
			var holding1 = new Holding(property,12);
			var holding2 = new Holding(property,8);
			account.addHolding(holding1);
			account.addHolding(holding2);
			assert(account.holding(holding1).count == 20);
		},
		'holding is removed entirely',tm => {
			var account = new Account('owner');
			assert(account instanceof Holder);
			var property = new Property('test prop 1','uzalu');
			var holding = new Holding(property,10);
			account.addHolding(holding);
			account.removeHolding(holding);
			assert(account.holding(holding) === undefined);
		},
		'holding is removed partially',tm => {
			var account = new Account('owner');
			assert(account instanceof Holder);
			var property = new Property('test prop 1','uzalu');
			var holding = new Holding(property,10);
			account.addHolding(holding);
			var holdingPartial = new Holding(property,4);
			account.removeHolding(holdingPartial);
			var count = account.holding(holding).count
			assert(count == 6);
			return count;
		},
		'holding isn\'t removed when insufficient supply',tm => {
			var account = new Account('owner');
			assert(account instanceof Holder);
			var property = new Property('test prop 1','uzalu');
			var holding = new Holding(property,10);
			account.addHolding(holding);
			var holdingTooMuch = new Holding(property,12);
			try {
				account.removeHolding(holdingTooMuch);
			} catch(e){
				assert(e instanceof InsufficientSupplyError);
			}
		},
		'exchange',tm => {
			var account1 = new Account('owner1');
			var account2 = new Account('owner2');
			
			var property1 = new Property('test prop 1','uzalu');
			var property2 = new Property('test prop 2','uzalu');
			
			var holding1 = new Holding(property1,1);
			var holding2 = new Holding(property2,1);
			
			account1.addHolding(holding1);
			account2.addHolding(holding2);
			
			account1.exchange(account2,holding2,holding1);
			assert(holding1.holder == account2 && holding2.holder == account1);
		},
		'invalid exchange fails',tm => {
			var account1 = new Account('owner1');
			var account2 = new Account('owner2');
			
			var property1 = new Property('test prop 1','uzalu');
			var property2 = new Property('test prop 2','uzalu');
			
			var holding1 = new Holding(property1,1);
			var holding2 = new Holding(property2,1);
			
			account1.addHolding(holding1);
			// NOTE account 2 is not given its holding, as it was in the previous example
			
			try {
				account1.exchange(account2,[holding2],[holding1]);
				throw new Error('that wasn\'t supposed to work.');
			} catch(e){
				if(!(e instanceof InsufficientSupplyError)){
					throw e;
				}
			}
		},
		'holding assigned to two owners fails',tm => {
			var account1 = new Account('owner1');
			var account2 = new Account('owner2');
			
			var property = new Property('test prop 1','uzalu');
			
			var holding = new Holding(property,1);
			
			account1.addHolding(holding);
			try {
				account2.addHolding(holding);
				throw new Error('that wasn\'t supposed to work.');
			} catch(e){
				if(!(e instanceof HoldingAlreadyAssignedError)){
					throw e;
				}
			}
		},
	);
	
	return true;
}

// TODO write some tests for property content and effects.
