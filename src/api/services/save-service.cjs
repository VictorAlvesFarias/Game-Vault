const { v4: uid } = require('uuid');
const fs = require('fs');

class SaveItem {
    constructor(
        saveLocal,
        savePathOrigin,
        saveName,
        size,
        name,
        id,
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
        this.versions = versions;
        this.saveWithRachChange = saveWithRachChange;
    }
}

class Event {
    constructor(watcher, path) {
        this.watcher = watcher;
        this.path = path;
    }
}

class SaveService {
    constructor() {
        this.counter = 0;
        this.subscriptions = [];
    }

    async add(originPath, name) {
        const saveContext = this.document();
        const folder = this.splitFolderName(originPath);
        const guid = uid();

        const folderLocalSavePath = `./saves/${guid}/1/${folder}`;

        const newSave = new SaveItem(
            `./saves/${guid}`,    // Diretório base para salvamentos desse item
            originPath,
            folder,
            await this.getDirSize(originPath),
            name,
            guid
        );

        // Adiciona o novo save ao contexto e cria a pasta com índice 1
        saveContext.push(newSave);
        await fs.promises.mkdir(`./saves/${guid}/1`, { recursive: true });
        await fs.promises.cp(originPath, folderLocalSavePath, { recursive: true })
        await fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));
    }
    async get() {
        let saveContext = this.document().map(async (e) => {
            const sync = e.size == await this.getDirSize(e.savePathOrigin);
            return { ...e, sync };
        });

        return Promise.all(saveContext);

    }
    async delete(id) {
        const newSaveContext = this.document().filter(e => e.id != id);
        const save = this.getById(id);

        await fs.promises.cp(save.saveLocal, `./trash/${save.id}/${save.saveName}`, { recursive: true });
        await fs.promises.rmdir(`./saves/${save.id}`, { recursive: true });
        await fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));

        return newSaveContext;
    }
    async getDirSize(dirPath) {
        let size = 0;
        const files = await fs.promises.readdir(dirPath);

        for (let file of files) {
            this.counter++
            const filePath = dirPath + '/' + file;

            if (await fs.promises.stat(filePath).then(stat => stat.isDirectory())) {
                size += await this.getDirSize(filePath);
            }
            else {
                const file = await fs.promises.stat(filePath);
                size += file.size;
            }
        }
        return size;
    }
    document() {
        let saveContext = JSON.parse(
            fs.existsSync('./saves/save.json') ?
                fs.readFileSync('./saves/save.json', "utf-8")
                :
                'null'
        ) ?? [];

        return saveContext;
    }
    getById(id) {
        const result = this.document()?.filter(e => e.id == id)[0];
        return result;
    }
    splitFolderName(path) {
        const result = path.split('\\')[path.split('\\').length - 1];
        return result;
    }
    async sync(id) {
        const saveContext = this.document();
        const save = this.getById(id);
        const newSaveSize = await this.getDirSize(save.savePathOrigin);
        let newSyncPath;

        if (save.versions) {
            const existingSaves = await fs.promises.readdir(`./saves/${save.id}`);
            const indices = existingSaves
                .map(folder => parseInt(folder))
                .filter(num => !isNaN(num));
            const newIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;

            newSyncPath = `./saves/${save.id}/${newIndex}`;

            await fs.promises.mkdir(newSyncPath, { recursive: true });
        } else {
            newSyncPath = `./saves/${save.id}/static`;
        }
        await fs.promises.cp(save.savePathOrigin, `${newSyncPath}/${save.saveName}`, { recursive: true });

        const newSaveContext = saveContext.map((e) => {
            if (e.id === id) {
                e.size = newSaveSize;
                e.sync = true;
            }
            return e;
        });

        await fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));

        return save;
    }

    setWatcherEvent(folderPath, callback) {
        const watchers = this.subscriptions.filter(e => e.path);

        if (watchers.length > 0) {
            watchers.forEach(e => {
                e.watcher.close()
            });
        }

        this.subscriptions = this.subscriptions.filter(e => !watchers.some(s => s.path === e.path));

        const watcher = fs.watch(folderPath, (event) => {
            if (event === 'change') {
                callback(event);
            }
        });

        const event = new Event(watcher, folderPath);

        this.subscriptions.push(event);
    }

    async update(id, data) {
        const saveContext = this.document();
        const saveIndex = saveContext.findIndex((e) => e.id === id);

        if (saveIndex === -1) return null;

        const updatedSave = { ...saveContext[saveIndex], ...data };
        saveContext[saveIndex] = updatedSave;

        await fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));
        return updatedSave;
    }
}

const saveService = new SaveService();

module.exports = saveService;
