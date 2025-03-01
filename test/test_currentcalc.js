// CRISTIAN ECHEVERRÍA RABÍ

const cx = require('../cx.js');
const assert = require('assert');

//----------------------------------------------------------------------------------------

describe('cx.CurrentCalc', function() {

	//var cat, cond, cc;
	let condmk, cc;

	beforeEach(function() {
		let catmk = new cx.CategoryMaker('AAAC (AASC)', 0.0, 0.0, 0.0, 0.003400);
		condmk = new cx.ConductorMaker("AAAC 740,8 MCM FLINT", catmk, 25.17, 0.0, 0.0, 0.0, 0.089360);
	});

	//------------------------------------------------------------------------------------

	describe('constructor', function () {

		it('Check default values', function () {
			let cond = condmk.get();
			cc = new cx.CurrentCalc(cond);
			
			assert.equal(cc.conductor, cond);
			assert.equal(cc.altitude, 300);
			assert.equal(cc.airVelocity, 2);
			assert.equal(cc.sunEffect, 1);
			assert.equal(cc.emissivity, 0.5);
			assert.equal(cc.formula, cx.CF_IEEE);
			assert.equal(cc.deltaTemp, 0.01);
		});
		it('Check r25 > 0', function () {
			condmk.r25 = 0.001;
			assert.doesNotThrow(function() {new cx.CurrentCalc(condmk.get())});
			condmk.r25 = 0;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
			condmk.r25 = -0.001;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
		});
		it('Check Diameter > 0', function () {
			condmk.diameter = 0.001;
			assert.doesNotThrow(function() {new cx.CurrentCalc(condmk.get())});
			condmk.diameter = 0;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
			condmk.diameter = -0.001;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
		});
		it('Check 0 < Alpha < 1', function () {
			condmk.catmk.alpha = 0.001;
			assert.doesNotThrow(function() {new cx.CurrentCalc(condmk.get())});
			condmk.catmk.alpha = 0.999;
			assert.doesNotThrow(function() {new cx.CurrentCalc(condmk.get())});
			condmk.catmk.alpha = 0;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
			condmk.catmk.alpha = -0.001;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
			condmk.catmk.alpha = 1;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
			condmk.catmk.alpha = 1.001;
			assert.throws(function() {new cx.CurrentCalc(condmk.get())}, RangeError);
		});
	});

	//------------------------------------------------------------------------------------

	describe('properties', function () {

		beforeEach(function() {
			cc = new cx.CurrentCalc(condmk.get())
		});
		it('Read only', function () {
			assert.throws(function() {cc.conductor = 1}, TypeError);
		});
		it('altitude >= 0', function () {
			cc.altitude = 150;
			assert.equal(cc.altitude, 150);
			assert.doesNotThrow(function() {cc.altitude = 0});
			assert.throws(function() {cc.altitude = -0.001}, RangeError);
		});
		it('airVelocity >= 0', function () {
			cc.airVelocity = 2;
			assert.equal(cc.airVelocity, 2);
			assert.doesNotThrow(function() {cc.airVelocity = 0});
			assert.throws(function() {cc.airVelocity = -0.001}, RangeError);
		});
		it('0 <= sunEffect <= 1', function () {
			cc.sunEffect = 0.5;
			assert.equal(cc.sunEffect, 0.5);
			assert.doesNotThrow(function() {cc.sunEffect = 0});
			assert.doesNotThrow(function() {cc.sunEffect = 1});
			assert.throws(function() {cc.sunEffect = -0.001}, RangeError);
			assert.throws(function() {cc.sunEffect = 1.001}, RangeError);
		});
		it('0 <= emissivity <= 1', function () {
			cc.emissivity = 0.7;
			assert.equal(cc.emissivity, 0.7);
			assert.doesNotThrow(function() {cc.emissivity = 0});
			assert.doesNotThrow(function() {cc.emissivity = 1});
			assert.throws(function() {cc.emissivity = -0.001}, RangeError);
			assert.throws(function() {cc.emissivity = 1.001}, RangeError);
		});
		it('formula in [cx.CF_IEEE, cx.CF_CLASSIC]', function () {
			cc.formula = cx.CF_IEEE;
			assert.equal(cc.formula, cx.CF_IEEE);
			assert.doesNotThrow(function() {cc.formula = cx.CF_IEEE});
			assert.doesNotThrow(function() {cc.formula = cx.CF_CLASSIC});
			assert.throws(function() {cc.formula = -1}, RangeError);
			assert.throws(function() {cc.formula = 2}, RangeError);
		});
		it('deltaTemp > 0', function () {
			cc.deltaTemp = 0.001;
			assert.equal(cc.deltaTemp, 0.001);
			assert.doesNotThrow(function() {cc.deltaTemp = 0.0001});
			assert.throws(function() {cc.deltaTemp = -0.0001}, RangeError);
			assert.throws(function() {cc.deltaTemp = 0}, RangeError);
		});
	});

	//------------------------------------------------------------------------------------

	describe('methods', function () {

		beforeEach(function() {
			cc = new cx.CurrentCalc(condmk.get())
		});
		it('getResistance', function () {
			assert.doesNotThrow(function() {cc.getResistance(cx.TC_MIN)});
			assert.doesNotThrow(function() {cc.getResistance(cx.TC_MAX)});
			assert.throws(function() {cc.getResistance(cx.TC_MIN - 0.001)}, RangeError);
			assert.throws(function() {cc.getResistance(cx.TC_MAX + 0.001)}, RangeError);
		});
		it('getCurrent', function () {
			assert.equal(cc.getCurrent(25, 25), 0);
			assert.equal(cc.getCurrent(26, 25), 0);

			cc.formula = cx.CF_CLASSIC;
			assert(Math.abs(cc.getCurrent(25, 50) - 517.7) < 0.1);
			assert(Math.abs(cc.getCurrent(30, 60) - 585.4) < 0.1);
			assert(Math.abs(cc.getCurrent(10, 30) - 438.4) < 0.1);

			let amp1 = cc.getCurrent(3, 30);
			cc.formula = cx.CF_IEEE;
			var amp2 = cc.getCurrent(3, 30);
			assert.notEqual(amp1, amp2);

			cc.sunEffect = 1.0;
			amp1 = cc.getCurrent(25, 50);
			cc.sunEffect = 0.0;
			amp2 = cc.getCurrent(25, 50);
			assert.notEqual(amp1, amp2);

			assert.doesNotThrow(function() {cc.getCurrent(cx.TA_MIN, 50)});
			assert(cc.getCurrent(cx.TA_MAX, 50) >= 0);
			assert(cc.getCurrent(25, cx.TC_MIN) >= 0);
			assert.doesNotThrow(function() {cc.getCurrent(25, cx.TC_MAX)});
			assert.throws(function() {cc.getCurrent(cx.TA_MIN - 0.001, 50)}, RangeError);
			assert.throws(function() {cc.getCurrent(cx.TA_MAX + 0.001, 50)}, RangeError);
			assert.throws(function() {cc.getCurrent(25, cx.TC_MIN - 0.001)}, RangeError);
			assert.throws(function() {cc.getCurrent(25, cx.TC_MAX + 0.001)}, RangeError);
		});
		it('getTc', function () {
			// Verifica que los cálculos de getTc sean coherentes con getCurrent
			let amp1 = cc.getCurrent(25, 50);
			let amp2 = cc.getCurrent(35, 65);
			let tc1 = cc.getTc(25, amp1);
			let tc2 = cc.getTc(35, amp2);
			assert(Math.abs(tc1 - 50) < cc.deltaTemp);
			assert(Math.abs(tc2 - 65) < cc.deltaTemp);

			// Verifica rangos de entrada para ta
			let Icmax = cc.getCurrent(cx.TA_MIN, cx.TC_MAX);
			assert.doesNotThrow(function() {cc.getTc(cx.TA_MIN, Icmax)});
			assert.throws(function() {cc.getTc(cx.TA_MIN - 0.0001, Icmax)}, RangeError);
			Icmax = cc.getCurrent(cx.TA_MAX, cx.TC_MAX);
			assert.doesNotThrow(function() {cc.getTc(cx.TA_MAX, Icmax)});
			assert.throws(function() {cc.getTc(cx.TA_MAX + 0.0001, Icmax)}, RangeError);

			// Verifica rangos de entrada para ic
			assert.throws(function() {cc.getTc(30, -0.001)}, RangeError);
			Icmax = cc.getCurrent(30, cx.TC_MAX);
			assert.doesNotThrow(function() {cc.getTc(30, Icmax)});
			assert.throws(function() {cc.getTc(30, Icmax + 0.001)}, RangeError);
		});
		it('getTa', function () {
			// Verifica que los cálculos de getTa sean coherentes con getCurrent
			let amp1 = cc.getCurrent(25, 50);
			let amp2 = cc.getCurrent(35, 65);
			let ta1 = cc.getTa(50, amp1);
			let ta2 = cc.getTa(65, amp2);
			assert(Math.abs(ta1 - 25) < cc.deltaTemp);
			assert(Math.abs(ta2 - 35) < cc.deltaTemp);

			// Verifica rangos de entrada para tc
			assert.doesNotThrow(function() {cc.getTa(cx.TC_MIN, 0)});
			assert.throws(function() {cc.getTa(cx.TC_MIN - 0.0001, 0)}, RangeError);
			let Icmax = cc.getCurrent(cx.TA_MIN, cx.TC_MAX);
			assert.doesNotThrow(function() {cc.getTa(cx.TC_MAX, Icmax)});
			assert.throws(function() {cc.getTa(cx.TC_MAX + 0.0001, Icmax)}, RangeError);

			// Verifica rangos de entrada para ic
			let Icmin = cc.getCurrent(cx.TA_MAX, 100);
			Icmax = cc.getCurrent(cx.TA_MIN, 100);
			assert.doesNotThrow(function() {cc.getTa(100, Icmin)});
			assert.throws(function() {cc.getTa(100, Icmin - 0.0001)}, RangeError);
			assert.doesNotThrow(function() {cc.getTa(100, Icmax)});
			assert.throws(function() {cc.getTa(100, Icmax + 0.0001)}, RangeError);
		});
	});

});
