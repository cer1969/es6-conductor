// CRISTIAN ECHEVERRÍA RABÍ
import { check } from "./checker";
import * as k from "./constants";
//--------------------------------------------------------------------------------------------------
export class OperatingItem {
	constructor(currentcalc, tempMaxOp = 50.0, nsc = 1, altitude = 300.0, emissivity = 0.5) {
		/*
		currentcalc : CurrentCalc instance
		tempMaxOp   : Maximum operating temperature for currentcalc.conductor [°C]
		nsc         : Number of subconductor per face
		altitude    : Altitude [m] = 300.0
		emissivity  : Emissivity (0 to 1) = 0.5
		*/
		currentcalc.altitude = altitude;
		currentcalc.emissivity = emissivity;
		check(tempMaxOp).ge(k.TC_MIN).le(k.TC_MAX);
		check(nsc).ge(1);
		this._currentcalc = currentcalc;
		this._tempMaxOp = tempMaxOp;
		this._nsc = nsc;
	}
	// Public methods
	getCurrent(ta) {
		/*
		Returns current for the OperatingItems [ampere]
		ta : Ambient temperature [°C]
		*/
		return this._currentcalc.getCurrent(ta, this._tempMaxOp) * this._nsc;
	}
	getCurrentList(taList) {
		/*
		Returns list with current [ampere]
		taList: Secuence with ambient temperatures [°C]
		*/
		return taList.map(x => this.getCurrent(x));
	}
	// Propiedades
	get currentcalc() {
		return this._currentcalc;
	}
	set currentcalc(value) {
		throw new RangeError('OperatingItem.CurrentCalc is readonly');
	}
	get tempMaxOp() {
		return this._tempMaxOp;
	}
	set tempMaxOp(value) {
		throw new RangeError('OperatingItem.tempMaxOp is readonly');
	}
	get nsc() {
		return this._nsc;
	}
	set nsc(value) {
		throw new RangeError('OperatingItem.nsc is readonly');
	}
}
export class OperatingTable {
	/*
	Mutable secuence to store OperatingItem instances and calculates current.

	Constructor (Read-write properties)
	items : Secuence with OperatingItem instance
	idx   : Database key
	*/
	constructor(items = [], idx) {
		this.items = items;
		this.idx = idx;
	}
	getCurrent(ta) {
		/*
		Returns lowest current for the OperatingItems contained [ampere]
		ta : Ambient temperature [°C]
		*/
		let ampList = this.items.map(item => item.getCurrent(ta));
		return Math.min(...ampList);
	}
}
