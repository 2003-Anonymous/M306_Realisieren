class Vehicle {
    constructor(name, category, image, topSpeed, size, lastService, nextService) {
        this.name = name;
        this.category = category;
        this.image = image;
        this.topSpeed = topSpeed;
        this.size = size;
        this.lastService = lastService;
        this.nextService = nextService;
    }

    // Fahrzeuginformationen anzeigen
    getInfo() {
        return `${this.name} (${this.category})`;
    }

    // Serviceinformationen anzeigen
    getServiceInfo() {
        return `Letzter Service: ${this.lastService}, Nächster Service: ${this.nextService}`;
    }

    // Prüfen ob ein Bild vorhanden ist
    hasImage() {
        return this.image !== "";
    }
}
