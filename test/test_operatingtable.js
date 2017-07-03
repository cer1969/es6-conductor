// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../cx.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('cx.OperatingTable', function() {


	let cab0, cab1, cc0, cc1, item0, item1, opt;

	beforeEach(function() {
		cab0 = new cx.Conductor("CU 2/0 AWG",     cx.CC_CU,     10.50, 0, 0, 0, 0.276700, 0);
		cab1 = new cx.Conductor("COPPERWELD 3/8", cx.CC_CUWELD,  9.78, 0, 0, 0, 1.030581, 0);
		cc0 = new cx.CurrentCalc(cab0);
		cc1 = new cx.CurrentCalc(cab1);
		item0 = new cx.OperatingItem(cc0,  50, 1);
		item1 = new cx.OperatingItem(cc1, 125, 1);
		opt = new cx.OperatingTable();
	});

	//------------------------------------------------------------------------------------

	describe('cx.OperatingItem constructor', function () {
		it('Check default values', function () {
			assert.equal(item0.currentcalc.conductor, cab0);
			assert.equal(item0.tempMaxOp, 50.0);
			assert.equal(item0.nsc, 1);
		});
		it('Check TC_MIN <= tempMaxOp <= TC_MAX', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc0, cx.TC_MIN, 1);});
			assert.doesNotThrow(function() {new cx.OperatingItem(cc0, cx.TC_MAX, 1);});
			assert.throws(function() {new cx.OperatingItem(cc0, cx.TC_MIN - 0.001, 1);}, RangeError);
			assert.throws(function() {new cx.OperatingItem(cc0, cx.TC_MAX + 0.001, 1);}, RangeError);
		});
		it('Check nsc >= 1', function () {
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 1);});
			assert.doesNotThrow(function() {new cx.OperatingItem(cc1, 50, 2);});
			assert.throws(function() {new cx.OperatingItem(cc1, 50, 1 - 0.001);}, RangeError);
		});
	});

	describe('cx.OperatingItem properties', function () {
		it('Check readonly', function () {
			assert.throws(function() {item1.currentcalc = cc1;}, TypeError);
			assert.throws(function() {item1.tempMaxOp = 80;}, TypeError);
			assert.throws(function() {item1.nsc = 2;}, TypeError);
		});
	});

	//------------------------------------------------------------------------------------

	describe('cx.OperatingTable constructor', function () {
		it('Check default values', function () {
			assert.equal(opt.items.length, 0);
			assert.equal(opt.idx, null);
			opt = new cx.OperatingTable(23);
			assert.equal(opt.idx, 23);
		});
		it('Items append', function () {
			opt.items.push(item0, item1);
			assert.equal(opt.items[0].currentcalc.conductor, cab0);
			assert.equal(opt.items[1].currentcalc.conductor, cab1);
		});
	});

	describe('cx.OperatingTable properties', function () {
		it('Check readonly', function () {
			assert.throws(function() {opt.items = [];}, TypeError);
			assert.throws(function() {opt.idx = 10;}, TypeError);
		});
	});

	describe('cx.OperatingTable methods', function () {
		it('Check getCurrent', function () {
			opt.items.push(item0, item1);

			let ta = 25
			let ic = opt.getCurrent(ta)
			let ic0 = item0.getCurrent(ta)
			let ic1 = item1.getCurrent(ta)
			assert.equal(ic, Math.min(ic0, ic1));

			ta = 80
			ic = opt.getCurrent(ta)
			ic0 = item0.getCurrent(ta)
			ic1 = item1.getCurrent(ta)
			assert.equal(ic, Math.min(ic0, ic1));
		});
	});

});
