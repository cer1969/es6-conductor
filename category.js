// CRISTIAN ECHEVERRÍA RABÍ
// javascript es6

//--------------------------------------------------------------------------------------------------

export class CategoryMaker {
	/* Mutable object to create inmutable Category objects
	 * Same arguments that Category
	 */
	constructor(name, modelas=0.0, coefexp=0.0, creep=0.0, alpha=0.0, idx=null) {
		this.name = name;
		this.modelas = modelas;
		this.coefexp = coefexp;
		this.creep = creep;
		this.alpha = alpha;
		this.idx = idx;
	}

	static fromCategory(cat) {
		/* static method: Returns CategoryMaker object from Category object
		 * cat : Category object
		 */
		return CategoryMaker(cat.name, cat.modelas, cat.coefexp, cat.creep, cat.alpha, cat.idx);
	}

	get() {
		return new Category(this.name, this.modelas, this.coefexp, this.creep, this.alpha, this.idx);
	}
}

//--------------------------------------------------------------------------------------------------

export class Category {
	/* Represents a category of conductors with similar characteristics
	 */
	constructor(name, modelas=0.0, coefexp=0.0, creep=0.0, alpha=0.0, idx=null) {
		/* name    : Name of conductor category
		 * modelas : Modulus of elasticity [kg/mm2]
		 * coefexp : Coefficient of Thermal Expansion [1/°C]
		 * creep   : Creep [°C]
		 * alpha   : Temperature coefficient of resistance [1/°C]
		 * idx     : Database key
		 */
		this._name = name;
		this._modelas = modelas;
		this._coefexp = coefexp;
		this._creep = creep;
		this._alpha = alpha;
		this._idx = idx;
	}

	get name() {return this._name;}

	get modelas() {return this._modelas;}

	get coefexp() {return this._coefexp;}

	get creep() {return this._creep;}

	get alpha() {return this._alpha;}

	get idx() {return this._idx;}

}

//--------------------------------------------------------------------------------------------------

/* Category instances to use as constants */
export const CC_CU     = new Category('COPPER',      12000.0, 0.0000169,  0.0, 0.00374, 'CU');
export const CC_AAAC   = new Category('AAAC (AASC)',  6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
export const CC_ACAR   = new Category('ACAR',         6450.0, 0.0000250, 20.0, 0.00385, 'ACAR');
export const CC_ACSR   = new Category('ACSR',         8000.0, 0.0000191, 20.0, 0.00395, 'ACSR');
export const CC_AAC    = new Category('ALUMINUM',     5600.0, 0.0000230, 20.0, 0.00395, 'AAC');
export const CC_CUWELD = new Category('COPPERWELD',  16200.0, 0.0000130,  0.0, 0.00380, 'CUWELD');
export const CC_AASC   = CC_AAAC;
export const CC_ALL    = CC_AAC;