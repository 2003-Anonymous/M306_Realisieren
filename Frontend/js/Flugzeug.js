"use strict";

class Flugzeug extends Fahrzeug {
  constructor(data) {
    super({ ...data, kategorie: 'Flugzeug' });
  }

  get speedDisplay() {
    const mach = (this.hoechstgeschwindigkeit / 1235).toFixed(2);
    return `${this.hoechstgeschwindigkeit} km/h (Mach ${mach})`;
  }
}
