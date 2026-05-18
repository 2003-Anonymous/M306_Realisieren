class Boat extends Vehicle {
    constructor(name, image, topSpeed, size, lastService, nextService) {
        super(
            name,
            "Schiff",
            image,
            topSpeed,
            size,
            lastService,
            nextService
        );
    }

    startEngine() {
        return `${this.name} wurde gestartet.`;
    }

    stopEngine() {
        return `${this.name} wurde gestoppt.`;
    }

    getCategory() {
        return "Schiff";
    }

    needsService() {
        const today = new Date();
        const serviceDate = new Date(this.nextService);
        return serviceDate <= today;
    }
}


class Motorcycle extends Vehicle {
    constructor(name, image, topSpeed, size, lastService, nextService) {
        super(
            name,
            "Motorrad",
            image,
            topSpeed,
            size,
            lastService,
            nextService
        );
    }

    startEngine() {
        return `${this.name} wurde gestartet.`;
    }

    stopEngine() {
        return `${this.name} wurde gestoppt.`;
    }

    getCategory() {
        return "Motorrad";
    }

    needsService() {
        const today = new Date();
        const serviceDate = new Date(this.nextService);
        return serviceDate <= today;
    }
}