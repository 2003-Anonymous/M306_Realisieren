"use strict";

class Motorrad extends Fahrzeug {
  constructor(data) {
    super({ ...data, kategorie: 'Motorrad' });
  }

  get speedDisplay() {
    return `${this.hoechstgeschwindigkeit} km/h`;
  }
}
