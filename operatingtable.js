// CRISTIAN ECHEVERRÍA RABÍ
// javascript es6

import {TC_MIN, TC_MAX} from "./constants";

//--------------------------------------------------------------------------------------------------

export class OperatingItem {
	/* Container for conductor and operating conditions
	 *
	 * Read-only properties
	 * currentcalc : CurrentCalc instance
	 * tempMaxOp   : Maximux operating temperature for currentcalc.conductor [°C]
	 * nsc         : Number of subconductor per fase
	 */
	constructor(currentcalc, tempMaxOp=50.0, nsc=1) {
		/* currentcalc : CurrentCalc instance
		 * tempMaxOp   : Maximux operating temperature for currentcalc.conductor [°C]
		 * nsc         : Number of subconductor per fase
		 */
		if (tempMaxOp < TC_MIN) {throw new RangeError("tempMaxOp < TC_MIN");}
		if (tempMaxOp > TC_MAX) {throw new RangeError("tempMaxOp > TC_MAX");}
		if (nsc < 1) {throw new RangeError("nsc < 1");}

		this._currentcalc = currentcalc;
		this._tempMaxOp = tempMaxOp;
		this._nsc = nsc;
	}

	//--------------------------------------------------------------------------------------------------
	// Public methods

	getCurrent(ta) {
		/* Returns current for the OperatingItems [ampere]
		 * ta : Ambient temperature [°C]
		 */
		return this._currentcalc.getCurrent(ta, this._tempMaxOp) * this._nsc;
	}

	//------------------------------------------------------------------------------------------------
	// Read-only properties

	get currentcalc() {return this._currentcalc;}

	get tempMaxOp() {return this._tempMaxOp;}

	get nsc() {return this._nsc;}

}

//--------------------------------------------------------------------------------------------------

export class OperatingTable {
	/* Object to store OperatingItem instances and calculates current.
	 * 
	 * Read-only properties
	 * idx : Optional database key
	 * items: List of OperatingItem instances
	 */
	constructor(idx=null) {
		/* idx   : Database key
		 */
		this._items = [];
		this._idx = idx;
	}

	getCurrent(ta) {
		/* Returns lowest current for the OperatingItems contained [ampere]
		 * ta : Ambient temperature [°C]
		 */
		let ampList = this.items.map(item => item.getCurrent(ta));
		return Math.min(...ampList);
	}

	//------------------------------------------------------------------------------------------------
	// Read-only properties

	get items() {return this._items;}

	get idx() {return this._idx;}

}
