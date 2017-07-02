// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../cx.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('cx.OperatingItem', function() {


	let cab1, cab2, cc1, cc2, item;

	beforeEach(function() {
		cab1 = new cx.Conductor("CU 2/0 AWG",     cx.CC_CU,     10.50, 0, 0, 0, 0.276700, 0);
		cab2 = new cx.Conductor("COPPERWELD 3/8", cx.CC_CUWELD,  9.78, 0, 0, 0, 1.030581, 0);
		cc1 = new cx.CurrentCalc(cab1);
		cc2 = new cx.CurrentCalc(cab2);
		item = new cx.OperatingItem(cc1);
	});

	//------------------------------------------------------------------------------------

	describe('constructor', function () {
		it('Check default values', function () {
			//assert.equal(item.currentcalc.conductor, cab1);
			assert.equal(item.tempMaxOp, 50.0);
			assert.equal(item.nsc, 1);
			assert.equal(item.currentcalc.altitude, 300.0);
			assert.equal(item.currentcalc.emissivity, 0.5);
		});
		it('Check TC_MIN <= tempMaxOp <= TC_MAX', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, cx.TC_MIN, 1);});
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, cx.TC_MAX, 1);});
			assert.throws(function() {new cx.OperatingItem(cc1, cx.TC_MIN - 0.001, 1);}, RangeError);
			assert.throws(function() {new cx.OperatingItem(cc1, cx.TC_MAX + 0.001, 1);}, RangeError);
		});
		it('Check nsc >= 1', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 1);});
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 2);});
			assert.throws(function() {new cx.OperatingItem(cc1, 50, 1 - 0.001);}, RangeError);
		});

		it('altitude >= 0', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 1, 0);});
			assert.throws(function() {new cx.OperatingItem(cc1, 50, -0.001);}, RangeError);
		});
		it('0 <= emissivity <= 1', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 1, 0, 0);});
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 1, 0, 1);});
			assert.throws(function() {new cx.OperatingItem(cc1, 50, 1, 0, -0.001);}, RangeError);
			assert.throws(function() {new cx.OperatingItem(cc1, 50, 1, 0, 1.001);}, RangeError);
		});
	});

	//------------------------------------------------------------------------------------

	describe('properties', function () {
		it('Check readonly', function () {
			assert.throws(function() {item.currentcalc = cc2;}, RangeError);
			assert.throws(function() {item.tempMaxOp = 80;}, RangeError);
			assert.throws(function() {item.nsc = 2;}, RangeError);
		});
	});

	//------------------------------------------------------------------------------------

	/*describe('methods', function () {
		it('getCurrent', function () {
			assert.throws(function() {2+2;}, RangeError);
		});
		it('getCurrentList', function () {
			assert.throws(function() {2+2;}, RangeError);
		});
	});*/

});
