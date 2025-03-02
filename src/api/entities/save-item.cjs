class SaveItem {
    constructor(
        saveLocal,
        savePathOrigin,
        saveName,
        size,
        name,
        id,
        folderIsNotFound,
        sync = undefined,
        versions = undefined,
        saveWithRachChange = undefined
    ) {
        this.saveLocal = saveLocal;
        this.savePathOrigin = savePathOrigin;
        this.saveName = saveName;
        this.size = size;
        this.name = name;
        this.id = id;
        this.sync = sync;
        this.folderIsNotFound = folderIsNotFound
        this.versions = versions;
        this.saveWithRachChange = saveWithRachChange;
    }
}

module.exports = SaveItem