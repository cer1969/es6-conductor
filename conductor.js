// CRISTIAN ECHEVERRÍA RABÍ

//--------------------------------------------------------------------------------------------------

/**
 * Container for Conductor characteristics
 * 
 * @export
 * @class Conductor
 */
export class Conductor {
	
	/**
	 * Conductor constructor.
	 * 
	 * @param {string} name - Name of conductor
	 * @param {Category} category - Category instance
	 * @param {number} diameter - Diameter [mm]
	 * @param {number} area - Cross section area [mm2]
	 * @param {number} weight - Weight per unit [kg/m]
	 * @param {number} strength - Rated strength [kg]
	 * @param {number} r25 - Resistance at 25°C [Ohm/km]
	 * @param {number} hcap - Heat capacity [kcal/(ft*°C)]
	 * @param {string} [idx] - Database key, default to ""
	 * 
	 * @memberOf Conductor
	 */
	constructor(name, category, diameter, area, weight, strength, r25, hcap, idx="") {
		this.name = name;
		this.category = category;
		this.diameter = diameter;
		this.area = area;
		this.weight = weight;
		this.strength = strength;
		this.r25 = r25;
		this.hcap = hcap;
		this.idx = idx;
	}
}
