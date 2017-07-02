// CRISTIAN ECHEVERRÍA RABÍ
// javascript es6

import {CF_CLASSIC, CF_IEEE, TA_MIN, TA_MAX, TC_MIN, TC_MAX} from "./constants";

//--------------------------------------------------------------------------------------------------

export class CurrentCalc {
	/* Object to calculate conductor current and temperatures.
	 *
	 * Read-only properties
	 * conductor  : Conductor instance
	 * diameter   : Diameter [mm] from conductor
	 * r25        : Resistance at 25°C [Ohm/km] from conductor
	 * alpha      : Temperature coefficient of resistance [1/°C] from conductor
	 * 
	 * Read-write properties
	 * altitude    : Altitude [m] = 300.0
	 * airVelocity : Velocity of air stream [ft/seg] = 2.0
	 * sunEffect   : Sun effect factor (0 to 1) = 1.0
	 * emissivity  : Emissivity (0 to 1) = 0.5
	 * formula     : Define formula for current calculation = CF_IEEE
	 * deltaTemp   : Temperature difference to determine equality [°C] = 0.01
	 */
	constructor(conductor) {
		/* conductor : Conductor instance.
		 * Valid values are required for r25, diameter and category.alpha
		 */
		if (conductor._diameter <= 0) {throw new RangeError("diameter <= 0");}
		if (conductor._r25 <= 0) {throw new RangeError("r25 <= 0");}
		if (conductor._category._alpha <= 0) {throw new RangeError("category.alpha <= 0");}
		if (conductor._category._alpha >= 1) {throw new RangeError("category.alpha >= 1");}

		this._conductor = conductor;
		this._diameter = conductor._diameter;
		this._r25 = conductor._r25;
		this._alpha = conductor._category._alpha;
		
		this._altitude = 300.0;
		this._airVelocity = 2.0;
		this._sunEffect = 1.0;
		this._emissivity = 0.5;
		this._formula = CF_IEEE;
		this._deltaTemp = 0.01;
	}

	//--------------------------------------------------------------------------------------------------
	// Public methods

	getResistance(tc) {
		/* Returns resistance [Ohm/km]
		 * tc : Conductor temperature [°C]
		 */
		if (tc < TC_MIN) {throw new RangeError("tc < TC_MIN");}
		if (tc > TC_MAX) {throw new RangeError("tc > TC_MAX");}
		return this._r25 * (1 + this._alpha * (tc - 25));
	}

	getCurrent(ta, tc) {
		/* Returns current [ampere]
		 * ta : Ambient temperature [°C]
		 * tc : Conductor temperature [°C]
		 */
		if (ta < TA_MIN) {throw new RangeError("ta < TA_MIN");}
		if (ta > TA_MAX) {throw new RangeError("ta > TA_MAX");}
		if (tc < TC_MIN) {throw new RangeError("tc < TC_MIN");}
		if (tc > TC_MAX) {throw new RangeError("tc > TC_MAX");}
		
		if (ta >= tc) {
			return 0.0;
		}

		let D = this._diameter / 25.4;                                                // Diámetro en pulgadas
		let Pb = Math.pow(10, 1.880813592 - this._altitude / 18336);                  // Presión barométrica en cmHg
		let V = this._airVelocity * 3600;                                             // Vel. viento en pies/hora
		let Rc = this.getResistance(tc) * 0.0003048;                                  // Resistencia en ohm/pies
		let Tm = 0.5 * (tc + ta);                                                     // Temperatura media
		let Rf = 0.2901577 * Pb / (273 + Tm);                                         // Densidad rel.aire ¿lb/ft^3?
		let Uf = 0.04165 + 0.000111 * Tm;                                             // Viscosidad abs. aire ¿lb/(ft x hora)
		let Kf = 0.00739 + 0.0000227 * Tm;                                            // Coef. conductividad term. aire [Watt/(ft x °C)]
		let Qc = 0.283 * Math.sqrt(Rf) * Math.pow(D, 0.75) * Math.pow(tc - ta, 1.25); // watt/ft
		if (V != 0) {
			let factor = D * Rf * V / Uf;
			let Qc1 = 0.1695 * Kf * (tc - ta) * Math.pow(factor, 0.6);
			let Qc2 = Kf * (tc - ta) * (1.01 + 0.371 * Math.pow(factor, 0.52));
			if (this._formula == CF_IEEE) {
				Qc = Math.max(Qc, Qc1, Qc2);
			}
			else {
				if (factor < 12000) {
					Qc = Qc2;
				}
				else {
					Qc = Qc1;
				}
			}
		}
		let LK = Math.pow((tc + 273) / 100, 4);
		let MK = Math.pow((ta + 273) / 100, 4);
		let Qr = 0.138 * D * this._emissivity * (LK - MK);
		let Qs = 3.87 * D * this._sunEffect;
		if ((Qc + Qr) < Qs) {
			return 0.0;
		}
		else {
			return Math.sqrt((Qc + Qr - Qs) / Rc);
		}
	}

	getTc(ta, ic) {
		/* Returns conductor temperature [ampere]
		 * ta : Ambient temperature [°C]
		 * ic : Current [ampere]
		*/
		if (ta < TA_MIN) {throw new RangeError("ta < TA_MIN");}
		if (ta > TA_MAX) {throw new RangeError("ta > TA_MAX");}
		if (ic < 0) {throw new RangeError("ic < 0");}
		if (ic > this.getCurrent(ta, TC_MAX)) {throw new RangeError("ic > Imax (TC_MAX)");}

		let Tmin = ta;
		let Tmax = TC_MAX;
		//let cuenta = 0;
		let Tmed, Imed;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5 * (Tmin + Tmax);
			Imed = this.getCurrent(ta, Tmed);
			if (Imed > ic) {
				Tmax = Tmed;
			}
			else {
				Tmin = Tmed;
			}
			//cuenta = cuenta + 1;
			//if (cuenta > k.ITER_MAX) {
			//	let err_msg = `getTc(): N° iterations > ${k.ITER_MAX}`;
			//	throw new RangeError(err_msg);
			//}
		}
		return Tmed;
	}

	getTa(tc, ic) {
		/* Returns ambient temperature [ampere]
		 * tc : Conductor temperature [°C]
		 * ic : Current [ampere]
		*/
		if (tc < TC_MIN) {throw new RangeError("tc < TC_MIN");}
		if (tc > TC_MAX) {throw new RangeError("tc > TC_MAX");}
		if (ic < this.getCurrent(TA_MAX, tc)) {throw new RangeError("ic < Imin (TA_MAX)");}
		if (ic > this.getCurrent(TA_MIN, tc)) {throw new RangeError("ic > Imax (TA_MIN)");}

		let Tmin = TA_MIN;
		let Tmax = Math.min(TA_MAX, tc);
		if (Tmin >= Tmax) {
			return tc;
		}
		//let cuenta = 0;
		let Tmed, Imed;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5 * (Tmin + Tmax);
			Imed = this.getCurrent(Tmed, tc);
			if (Imed > ic) {
				Tmin = Tmed;
			}
			else {
				Tmax = Tmed;
			}
			//cuenta = cuenta + 1;
			//if (cuenta > k.ITER_MAX) {
			//	let err_msg = `getTa(): N° iterations > ${k.ITER_MAX}`;
			//	throw new RangeError(err_msg);
			//}
		}
		return Tmed;
	}

	//--------------------------------------------------------------------------------------------------
	// Read-only properties

	get conductor() {return this._conductor;}

	get diameter() {return this._diameter;}

	get r25() {return this._r25;}

	get alpha() {return this._alpha;}

	//--------------------------------------------------------------------------------------------------
	// Read-write properties

	get altitude() {return this._altitude;}
	set altitude(v) {
		if (v < 0) {throw new RangeError("altitude < 0");}
		this._altitude = v;
	}

	get airVelocity() {return this._airVelocity;}
	set airVelocity(v) {
		if (v < 0) {throw new RangeError("airVelocity < 0");}
		this._airVelocity = v;
	}

	get sunEffect() {return this._sunEffect;}
	set sunEffect(v) {
		if (v < 0) {throw new RangeError("sunEffect < 0");}
		if (v > 1) {throw new RangeError("sunEffect > 1");}
		this._sunEffect = v;
	}

	get emissivity() {return this._emissivity;}
	set emissivity(v) {
		if (v < 0) {throw new RangeError("emissivity < 0");}
		if (v > 1) {throw new RangeError("emissivity > 1");}
		this._emissivity = v;
	}

	get formula() {return this._formula;}
	set formula(v) {
		if([CF_CLASSIC, CF_IEEE].indexOf(v) == -1) {throw new RangeError("formula <> CF_IEEE, CF_CLASSIC");}
		this._formula = v;
	}

	get deltaTemp() {return this._deltaTemp;}
	set deltaTemp(v) {
		if (v <= 0) {throw new RangeError("deltaTemp <= 0");}
		this._deltaTemp = v;
	}
}
