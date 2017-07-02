// CRISTIAN ECHEVERRÍA RABÍ

import { check } from "./checker";
import * as k from "./constants";

//--------------------------------------------------------------------------------------------------

/**
 * Object to calculate conductor current and temperatures.
 * 
 * @export
 * @class CurrentCalc
 */
export class CurrentCalc {
	
	/**
	 * CurrentCalc constructor.
	 * 
	 * @param {Conductor} conductor  Conductor instance.
	 * 
	 * Valid values are required for r25, diameter and category.alpha. This parameters are copied
	 * to CurrentCalc and cannot be changed. 
	 * Subsequent changes in the Conductor will not be reflected in this object.
	 * 
	 * @throws {RangeError} if not (conductor.r25 > 0)
	 * @throws {RangeError} if not (conductor.diameter > 0)
	 * @throws {RangeError} if not (0 < conductor.category.alpha < 1)
	 * 
	 * @memberOf CurrentCalc
	 */
	constructor(conductor) {
		check(conductor.r25).gt(0);
		check(conductor.diameter).gt(0);
		check(conductor.category.alpha).gt(0).lt(1);

		this._r25 = conductor.r25
		this._diameter = conductor.diameter
		this._alpha = conductor.category.alpha
		this._altitude = 300.0;
		this._airVelocity = 2.0;
		this._sunEffect = 1.0;
		this._emissivity = 0.5;
		this._formula = k.CF_IEEE;
		this._deltaTemp = 0.01;
	}

	//--------------------------------------------------------------------------------------------------
	// Public methods

	/**
	 * Returns resistance as function of conductor temperature
	 * 
	 * @param {number} tc - Conductor temperature [°C]
	 * @returns {number} Resistance [Ohm/km]
	 * @throws {RangeError} if not (TC_MIN <= tc <= TC_MAX)
	 * 
	 * @memberOf CurrentCalc
	 */
	getResistance(tc) {
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);
		return this._r25 * (1 + this._alpha * (tc - 25));
	}

	/**
	 * Returns current as function of ambient and conductor temperatures
	 * 
	 * @param {number} ta - Ambient temperature [°C]
	 * @param {number} tc - Conductor temperature [°C]
	 * @returns {number} Current [ampere]
	 * @throws {RangeError} if not (TA_MIN <= ta <= TA_MAX)
	 * @throws {RangeError} if not (TC_MIN <= tc <= TC_MAX)
	 * 
	 * @memberOf CurrentCalc
	 */
	getCurrent(ta, tc) {
		check(ta).ge(k.TA_MIN).le(k.TA_MAX);
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);
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
			if (this._formula == k.CF_IEEE) {
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
		/*
		Returns conductor temperature [ampere]
		ta : Ambient temperature [°C]
		ic : Current [ampere]
		*/
		check(ta).ge(k.TA_MIN).le(k.TA_MAX);
		let _Imin = 0;
		let _Imax = this.getCurrent(ta, k.TC_MAX);
		check(ic).ge(_Imin).le(_Imax); // Ensure ta <= Tc <= TC_MAX
		let Tmin = ta;
		let Tmax = k.TC_MAX;
		let cuenta = 0;
		let Tmed;
		let Imed;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5 * (Tmin + Tmax);
			Imed = this.getCurrent(ta, Tmed);
			if (Imed > ic) {
				Tmax = Tmed;
			}
			else {
				Tmin = Tmed;
			}
			cuenta = cuenta + 1;
			if (cuenta > k.ITER_MAX) {
				let err_msg = `getTc(): N° iterations > ${k.ITER_MAX}`;
				throw new RangeError(err_msg);
			}
		}
		return Tmed;
	}
	getTa(tc, ic) {
		/*
		Returns ambient temperature [ampere]
		tc : Conductor temperature [°C]
		ic : Current [ampere]
		*/
		check(tc).ge(k.TC_MIN).le(k.TC_MAX);
		let _Imin = this.getCurrent(k.TA_MAX, tc);
		let _Imax = this.getCurrent(k.TA_MIN, tc);
		check(ic).ge(_Imin).le(_Imax); // Ensure TA_MIN =< Ta =< TA_MAX
		let Tmin = k.TA_MIN;
		let Tmax = Math.min(k.TA_MAX, tc);
		if (Tmin >= Tmax) {
			return tc;
		}
		let cuenta = 0;
		let Tmed;
		let Imed;
		while ((Tmax - Tmin) > this._deltaTemp) {
			Tmed = 0.5 * (Tmin + Tmax);
			Imed = this.getCurrent(Tmed, tc);
			if (Imed > ic) {
				Tmin = Tmed;
			}
			else {
				Tmax = Tmed;
			}
			cuenta = cuenta + 1;
			if (cuenta > k.ITER_MAX) {
				let err_msg = `getTa(): N° iterations > ${k.ITER_MAX}`;
				throw new RangeError(err_msg);
			}
		}
		return Tmed;
	}

	get altitude() {
		return this._altitude; /// <reference path="./constants.ts"/>
	}
	set altitude(value) {
		check(value).ge(0);
		this._altitude = value;
	}
	get airVelocity() {
		return this._airVelocity;
	}
	set airVelocity(value) {
		check(value).ge(0);
		this._airVelocity = value;
	}
	get sunEffect() {
		return this._sunEffect;
	}
	set sunEffect(value) {
		check(value).ge(0).le(1);
		this._sunEffect = value;
	}
	get emissivity() {
		return this._emissivity;
	}
	set emissivity(value) {
		check(value).ge(0).le(1);
		this._emissivity = value;
	}
	get formula() {
		return this._formula;
	}
	set formula(value) {
		check(value).isIn([k.CF_CLASSIC, k.CF_IEEE]);
		this._formula = value;
	}
	get deltaTemp() {
		return this._deltaTemp;
	}
	set deltaTemp(value) {
		check(value).gt(0);
		this._deltaTemp = value;
	}
}
