class Plane {

    #id;

    constructor(id, name, category, maxSpeed, size, lastService, nextService, image) {
        this.#id = id;
        this.name = name;
        this.category = category;
        this.maxSpeed = maxSpeed;
        this.size = size;
        this.lastService = lastService;
        this.nextService = nextService;
        this.image = image;
    }

    getId() {
        return this.#id;
    }

    setId(newId) {
        this.#id = newId;
    }

    doService(vehicle) {
        this.lastService = new Date();

        this.nextService = new Date();
        this.nextService.setFullYear(this.nextService.getFullYear() + 3);
    }

    printServices() {
        console.log(`Last service: ${this.lastService}`);
        console.log(`Next service: ${this.nextService}`);
    }
}