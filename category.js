// CRISTIAN ECHEVERRÍA RABÍ

//--------------------------------------------------------------------------------------------------

/**
 * Container for Category characteristics
 * Represents a type of conductors with similar characteristics
 * 
 * @export
 * @class Category
 */
export class Category {

	/**
	 * Category constructor.
	 * 
	 * @param {string} name - Name of conductor category
	 * @param {number} modelas - Modulus of elasticity [kg/mm2]
	 * @param {number} coefexp - Coefficient of Thermal Expansion [1/°C]
	 * @param {number} creep - Creep [°C]
	 * @param {number} alpha - Temperature coefficient of resistance [1/°C]
	 * @param {string} [idx] - Database key, default to ""
	 * 
	 * @memberOf Category
	 */
	constructor(name, modelas, coefexp, creep, alpha, idx="") {
		this.name = name;
		this.modelas = modelas;
		this.coefexp = coefexp;
		this.creep = creep;
		this.alpha = alpha;
		this.idx = idx;
	}
}

//--------------------------------------------------------------------------------------------------

/* Category instances to use as constants */
export const CC_CU = new Category('COPPER', 12000.0, 0.0000169, 0.0, 0.00374, 'CU');
export const CC_AAAC = new Category('AAAC (AASC)', 6450.0, 0.0000230, 20.0, 0.00340, 'AAAC');
export const CC_ACAR = new Category('ACAR', 6450.0, 0.0000250, 20.0, 0.00385, 'ACAR');
export const CC_ACSR = new Category('ACSR', 8000.0, 0.0000191, 20.0, 0.00395, 'ACSR');
export const CC_AAC = new Category('ALUMINUM', 5600.0, 0.0000230, 20.0, 0.00395, 'AAC');
export const CC_CUWELD = new Category('COPPERWELD', 16200.0, 0.0000130, 0.0, 0.00380, 'CUWELD');
export const CC_AASC = CC_AAAC;
export const CC_ALL = CC_AAC;
