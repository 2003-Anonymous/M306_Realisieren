"use strict";

class Auto extends Fahrzeug {
  constructor(data) {
    super({ ...data, kategorie: 'Auto' });
  }

  get speedDisplay() {
    return `${this.hoechstgeschwindigkeit} km/h`;
  }
}
