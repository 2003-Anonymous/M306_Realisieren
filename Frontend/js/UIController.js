"use strict";

class UIController {
  #mgr;
  #currentKat = null;

  constructor(manager) {
    this.#mgr = manager;
    this.#bindGlobal();
    this.showHome();
  }

  async showHome() {
    this.#currentKat = null;
    this.#toggleView('home');
    document.getElementById('btn-home').style.display = 'none';
    document.getElementById('btn-add').style.display  = 'none';
    await this.#renderKategorien();
  }

  async showKategorie(kat) {
    this.#currentKat = kat;
    this.#toggleView('category');
    document.getElementById('btn-home').style.display = 'inline-flex';
    document.getElementById('btn-add').style.display  = 'inline-flex';
    document.getElementById('category-title').textContent = kat;
    await this.#renderFahrzeuge(kat);
  }

  async openForm(id = null) {
    const f = id ? await this.#mgr.getById(id) : null;
    document.getElementById('modal-title').textContent           = f ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug';
    document.getElementById('form-id').value                     = f?._id ?? '';
    document.getElementById('form-name').value                   = f?.name ?? '';
    document.getElementById('form-kategorie').value              = f?.kategorie ?? (this.#currentKat ?? 'Auto');
    document.getElementById('form-geschwindigkeit').value        = f?.hoechstgeschwindigkeit ?? '';
    document.getElementById('form-groesse').value                = f?.groesse ?? '';
    document.getElementById('form-letzter-service').value        = f?.letzterService ?? '';
    document.getElementById('form-naechster-service').value      = f?.naechsterService ?? '';
    document.getElementById('form-bild').value                   = f?.bild ?? '';
    this.#showPanel('form');
  }

  async openDetail(id) {
    const f = await this.#mgr.getById(id);
    if (!f) return;

    const imgAttrs = f.bild
      ? `src="${this.#esc(f.bild)}"`
      : `data-wiki="${this.#esc(f.name)}"`;

    document.getElementById('detail-content').innerHTML = `
      <div class="detail-img-wrap">
        <img ${imgAttrs} alt="${this.#esc(f.name)}"
             style="width:100%;height:100%;object-fit:cover"
             onerror="this.style.display='none'">
      </div>
      <div class="detail-name">
        <h2>${this.#esc(f.name)}</h2>
        <span class="badge-kategorie">${f.kategorie}</span>
      </div>
      <div class="detail-fields">
        <div class="detail-field">
          <label>Hoechstgeschwindigkeit</label>
          <span>${f.speedDisplay}</span>
        </div>
        <div class="detail-field">
          <label>Groesse</label>
          <span>${this.#esc(f.groesse)}</span>
        </div>
        <div class="detail-field">
          <label>Letzter Service</label>
          <span>${this.#fmtDate(f.letzterService)}</span>
        </div>
        <div class="detail-field">
          <label>Naechster Service</label>
          <span class="${f.serviceStatusClass}">
            ${this.#fmtDate(f.naechsterService)}
            &nbsp;<span class="service-badge ${f.serviceStatusClass}">${f.serviceStatus}</span>
          </span>
        </div>
      </div>
      <div class="detail-actions">
        <button class="btn btn-outline" onclick="app.openForm('${f._id}')">Bearbeiten</button>
        <button class="btn btn-danger"  onclick="app.confirmDelete('${f._id}')">Loeschen</button>
      </div>`;

    document.getElementById('modal-title').textContent = f.name;

    const detailImg = document.querySelector('#detail-content img[data-wiki]');
    if (detailImg) this.#loadWikiImage(detailImg);

    this.#showPanel('detail');
  }

  async confirmDelete(id) {
    const f = await this.#mgr.getById(id);
    if (!f) return;
    if (!confirm(`"${f.name}" wirklich loeschen?`)) return;
    try {
      await this.#mgr.delete(id);
      this.closeModal();
      this.#toast(`${f.name} geloescht.`);
      if (this.#currentKat) await this.showKategorie(this.#currentKat);
    } catch (e) {
      this.#toast(`Fehler beim Loeschen: ${e.message}`);
    }
  }

  closeModal() {
    document.getElementById('modal-overlay').classList.remove('active');
  }

  #bindGlobal() {
    document.getElementById('modal-overlay').addEventListener('click', e => {
      if (e.target.id === 'modal-overlay') this.closeModal();
    });
    document.getElementById('btn-close-modal').addEventListener('click', () => this.closeModal());
    document.getElementById('btn-cancel').addEventListener('click',      () => this.closeModal());
    document.getElementById('btn-home').addEventListener('click',        () => this.showHome());
    document.getElementById('btn-add').addEventListener('click',         () => this.openForm());
    document.getElementById('fahrzeug-form').addEventListener('submit',  e  => {
      e.preventDefault();
      this.#submitForm();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeModal();
    });
  }

  async #submitForm() {
    const data = {
      name:                   document.getElementById('form-name').value.trim(),
      kategorie:              document.getElementById('form-kategorie').value,
      hoechstgeschwindigkeit: document.getElementById('form-geschwindigkeit').value,
      groesse:                document.getElementById('form-groesse').value.trim(),
      letzterService:         document.getElementById('form-letzter-service').value,
      naechsterService:       document.getElementById('form-naechster-service').value,
      bild:                   document.getElementById('form-bild').value.trim(),
    };
    const id = document.getElementById('form-id').value;
    try {
      if (id) {
        await this.#mgr.update(id, data);
        this.#toast(`${data.name} aktualisiert.`);
      } else {
        await this.#mgr.add(data);
        this.#toast(`${data.name} hinzugefuegt.`);
      }
      this.closeModal();
      await this.showKategorie(data.kategorie);
    } catch (e) {
      this.#toast(`Fehler beim Speichern: ${e.message}`);
    }
  }

  async #renderKategorien() {
    try {
      const all = await this.#mgr.getAll();
      const grid = document.getElementById('kategorie-grid');
      grid.innerHTML = FahrzeugManager.KATEGORIEN.map(kat => {
        const count = all.filter(f => f.kategorie === kat).length;
        return `
          <div class="kategorie-card" data-kategorie="${kat}" onclick="app.showKategorie('${kat}')">
            <div class="kategorie-icon">${kat}</div>
            <div class="kategorie-name">${kat}</div>
            <div class="kategorie-count">
              ${count} Fahrzeug${count !== 1 ? 'e' : ''}
            </div>
          </div>`;
      }).join('');
    } catch (e) {
      this.#toast(`Fehler beim Laden: ${e.message}`);
    }
  }

  async #renderFahrzeuge(kat) {
    try {
      const list = await this.#mgr.getByKategorie(kat);
      const grid = document.getElementById('fahrzeug-grid');

      if (list.length === 0) {
        grid.innerHTML = `
          <div class="empty-state" style="grid-column:1/-1">
            <div class="empty-icon">${kat}</div>
            <p>Noch keine Fahrzeuge in dieser Kategorie.</p>
            <button class="btn btn-primary" onclick="app.openForm()">Erstes Fahrzeug erstellen</button>
          </div>`;
        return;
      }

      grid.innerHTML = list.map(f => {
        const imgAttrs = f.bild
          ? `src="${this.#esc(f.bild)}"`
          : `data-wiki="${this.#esc(f.name)}"`;
        return `
          <div class="fahrzeug-card" data-id="${f._id}" onclick="app.openDetail('${f._id}')">
            <div class="fahrzeug-img-wrapper">
              <img class="fahrzeug-img" ${imgAttrs} alt="${this.#esc(f.name)}"
                   onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
              <div class="fahrzeug-img-placeholder">${kat}</div>
            </div>
            <div class="fahrzeug-body">
              <h3>${this.#esc(f.name)}</h3>
              <div class="fahrzeug-meta">
                <span>${f.speedDisplay}</span>
                <span>${this.#esc(f.groesse)}</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="service-badge ${f.serviceStatusClass}">Service: ${f.serviceStatus}</span>
              <div style="display:flex;gap:6px" onclick="event.stopPropagation()">
                <button class="btn btn-outline btn-sm" onclick="app.openForm('${f._id}')">Bearbeiten</button>
                <button class="btn btn-danger  btn-sm" onclick="app.confirmDelete('${f._id}')">Loeschen</button>
              </div>
            </div>
          </div>`;
      }).join('');

      // Wikipedia-Bilder fuer Fahrzeuge ohne manuelles Bild nachladen
      grid.querySelectorAll('img[data-wiki]').forEach(img => this.#loadWikiImage(img));
    } catch (e) {
      this.#toast(`Fehler beim Laden: ${e.message}`);
    }
  }

  async #loadWikiImage(imgEl) {
    const name = imgEl.dataset.wiki;
    const placeholder = imgEl.nextElementSibling;
    try {
      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`
      );
      if (!res.ok) { placeholder?.style.setProperty('display', 'flex'); return; }
      const data = await res.json();
      if (data.thumbnail?.source) {
        imgEl.src = data.thumbnail.source;
        placeholder && (placeholder.style.display = 'none');
      } else {
        placeholder?.style.setProperty('display', 'flex');
      }
    } catch {
      placeholder?.style.setProperty('display', 'flex');
    }
  }

  #showPanel(panel) {
    document.getElementById('panel-form').style.display   = panel === 'form'   ? 'block' : 'none';
    document.getElementById('panel-detail').style.display = panel === 'detail' ? 'block' : 'none';
    document.getElementById('modal-overlay').classList.add('active');
  }

  #toggleView(view) {
    document.getElementById('home-view').style.display     = view === 'home'     ? 'block' : 'none';
    document.getElementById('category-view').style.display = view === 'category' ? 'block' : 'none';
  }

  #fmtDate(str) {
    if (!str) return '-';
    return new Date(str).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  #esc(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  #toast(msg) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
  }
}
