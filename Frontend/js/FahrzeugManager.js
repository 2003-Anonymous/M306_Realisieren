"use strict";

class FahrzeugManager {
  static KATEGORIEN = ['Auto', 'Flugzeug', 'Schiff', 'Motorrad'];

  #base = 'https://localhost:7138/api/vehicle';

  // Backend-JSON → Frontend-Objekt
  #toFrontend(d) {
    return {
      _id:                    d.id,
      name:                   d.name,
      kategorie:              d.category,
      hoechstgeschwindigkeit: d.maxSpeed,
      groesse:                `${d.length} m`,
      letzterService:         d.lastService   ? d.lastService.split('T')[0]   : '',
      naechsterService:       d.nextService   ? d.nextService.split('T')[0]   : '',
      bild:                   d.image ?? '',
    };
  }

  // Frontend-Objekt → Backend-JSON (id nur mitsenden wenn vorhanden)
  #toBackend(f) {
    const out = {
      name:        f.name,
      category:    f.kategorie,
      maxSpeed:    Number(f.hoechstgeschwindigkeit),
      length:      parseFloat(f.groesse) || 0,
      lastService: f.letzterService   ? new Date(f.letzterService).toISOString()   : null,
      nextService: f.naechsterService ? new Date(f.naechsterService).toISOString() : null,
      image:       f.bild ?? '',
    };
    if (f._id) out.id = f._id;
    return out;
  }

  async getAll() {
    const res = await fetch(this.#base);
    if (!res.ok) throw new Error(`GET /vehicle fehlgeschlagen: ${res.status}`);
    return (await res.json()).map(d => Fahrzeug.fromJSON(this.#toFrontend(d)));
  }

  async getById(id) {
    const res = await fetch(`${this.#base}/${id}`);
    if (!res.ok) return null;
    return Fahrzeug.fromJSON(this.#toFrontend(await res.json()));
  }

  // Kein Kategorie-Endpoint im Controller → clientseitig filtern
  async getByKategorie(kat) {
    const all = await this.getAll();
    return all.filter(f => f.kategorie === kat);
  }

  async add(data) {
    // Kein _id mitsenden – MongoDB generiert eine gültige ObjectId
    const res = await fetch(this.#base, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.#toBackend(data)),
    });
    if (!res.ok) throw new Error(`POST /vehicle fehlgeschlagen: ${res.status}`);
    return Fahrzeug.fromJSON(this.#toFrontend(await res.json()));
  }

  async update(id, data) {
    // PUT erwartet id im Body (Controller prüft id != vehicle.Id)
    const res = await fetch(`${this.#base}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.#toBackend({ ...data, _id: id })),
    });
    if (!res.ok) throw new Error(`PUT /vehicle/${id} fehlgeschlagen: ${res.status}`);
    // PUT gibt 204 No Content zurück → Fahrzeug aus gesendeten Daten rekonstruieren
    return Fahrzeug.fromJSON({ ...data, _id: id });
  }

  async delete(id) {
    const res = await fetch(`${this.#base}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`DELETE /vehicle/${id} fehlgeschlagen: ${res.status}`);
    // DELETE gibt 204 No Content zurück
    return true;
  }
}
