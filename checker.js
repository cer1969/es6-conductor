// CRISTIAN ECHEVERRÍA RABÍ

//--------------------------------------------------------------------------------------------------
// Comparison functions

function _lt(a, b) { return a < b; }
function _le(a, b) { return a <= b; }
function _ge(a, b) { return a >= b; }
function _gt(a, b) { return a > b; }
function _isIn(a, blist) {
	if (blist.indexOf(a) != -1) {
		return true;
	}
	return false;
}

//--------------------------------------------------------------------------------------------------

export class _Check {
	/*
	Class for value testing with error raising
	*/
	constructor(value) {
		this.value = value;
	}

	_compare(compFunc, txte, limit) {
		if (!compFunc(this.value, limit)) {
			let txt = `Required value ${txte} ${limit} (${this.value} entered)`;
			throw new RangeError(txt);
		}
		return this;
	}

	lt(limit) { return this._compare(_lt, "<", limit); }
	le(limit) { return this._compare(_le, "<=", limit); }
	gt(limit) { return this._compare(_gt, ">", limit); }
	ge(limit) { return this._compare(_ge, ">=", limit); }
	isIn(blist) { return this._compare(_isIn, "in", blist); }
	
	isFinite() {
		if (!isFinite(this.value)) {
			let txt = `Number expected (${this.value} entered)`;
			throw new RangeError(txt);
		}
		return this;
	}
}

//--------------------------------------------------------------------------------------------------
// Public function check

export function check(value) { return new _Check(value); }
