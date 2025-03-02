class Event {
    constructor(watcher, path) {
        this.watcher = watcher;
        this.path = path;
    }
}

module.exports = Event