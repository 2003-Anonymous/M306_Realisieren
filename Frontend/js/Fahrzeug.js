"use strict";

class Fahrzeug {
  constructor({ _id = null, name, kategorie, hoechstgeschwindigkeit, groesse,
                letzterService, naechsterService, bild = '' } = {}) {
    this._id                    = _id ?? Fahrzeug.#generateId();
    this.name                   = name;
    this.kategorie              = kategorie;
    this.hoechstgeschwindigkeit = Number(hoechstgeschwindigkeit);
    this.groesse                = groesse;
    this.letzterService         = letzterService;
    this.naechsterService       = naechsterService;
    this.bild                   = bild;
  }

  static #generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  static create(data) {
    const map = { Auto, Flugzeug, Schiff, Motorrad };
    const Cls = map[data.kategorie] ?? Fahrzeug;
    return new Cls(data);
  }

  static fromJSON(data) {
    return Fahrzeug.create(data);
  }

  toJSON() {
    return {
      _id: this._id, name: this.name, kategorie: this.kategorie,
      hoechstgeschwindigkeit: this.hoechstgeschwindigkeit, groesse: this.groesse,
      letzterService: this.letzterService, naechsterService: this.naechsterService,
      bild: this.bild
    };
  }

  get speedDisplay() { return `${this.hoechstgeschwindigkeit} km/h`; }

  get serviceStatus() {
    if (!this.naechsterService) return 'unbekannt';
    const diff = (new Date(this.naechsterService) - new Date()) / 86_400_000;
    if (diff < 0)  return 'ueberfaellig';
    if (diff < 30) return 'bald faellig';
    return 'ok';
  }

  get serviceStatusClass() {
    return {
      ok:             'status-ok',
      'bald faellig': 'status-warning',
      'ueberfaellig': 'status-overdue'
    }[this.serviceStatus] ?? '';
  }
}
