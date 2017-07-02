// CRISTIAN ECHEVERRÍA RABÍ
// javascript es6

//--------------------------------------------------------------------------------------------------

export class ConductorMaker {
	/* Mutable object to create inmutable Conductor objects
	 * Same arguments that Conductor except category is replaced for catmk
	 * catmk : CategoryMaker object
	 */
	constructor(name, catmk, diameter=0.0, area=0.0, weight=0.0, strength=0.0, r25=0.0, hcap=0.0, 
							idx=null) {
		this.name = name;
		this.catmk = catmk;
		this.diameter = diameter;
		this.area = area;
		this.weight = weight;
		this.strength = strength;
		this.r25 = r25;
		this.hcap = hcap;
		this.idx = idx;
	}

	get() {
		return Conductor(this.name, this.catmk.get(), this.diameter, this.area, this.weight, this.strength,
										 this.r25, this.hcap, this.idx);
	}
}

//--------------------------------------------------------------------------------------------------

export class Conductor {
	/* Container for conductor characteristics
	 */
	
	constructor(name, category, diameter, area, weight, strength, r25, hcap, idx="") {
		/* 
		 * name     : Name of conductor
		 * category : Category instance
		 * diameter : Diameter [mm]
		 * area     : Cross section area [mm2]
		 * weight   : Weight per unit [kg/m]
		 * strength : Rated strength [kg]
		 * r25      : Resistance at 25°C [Ohm/km]
		 * hcap     : Heat capacity [kcal/(ft*°C)]
		 * idx      : Database key
		 */
		this._name = name;
		this._category = category;
		this._diameter = diameter;
		this._area = area;
		this._weight = weight;
		this._strength = strength;
		this._r25 = r25;
		this._hcap = hcap;
		this._idx = idx;
	}

	get name() {return this._name;}

	get category() {return this._category;}

	get diameter() {return this._diameter;}

	get area() {return this._area;}

	get weight() {return this._weight;}

	get strength() {return this._strength;}

	get r25() {return this._r25;}

	get hcap() {return this._hcap;}

	get idx() {return this._idx;}
	
}
