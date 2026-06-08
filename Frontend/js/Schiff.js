"use strict";

class Schiff extends Fahrzeug {
  constructor(data) {
    super({ ...data, kategorie: 'Schiff' });
  }

  get speedDisplay() {
    const kn = (this.hoechstgeschwindigkeit / 1.852).toFixed(1);
    return `${this.hoechstgeschwindigkeit} km/h (${kn} kn)`;
  }
}
