const { v4: uid } = require('uuid');
const fs = require('fs');
const BaseResponse = require('../entities/base-response.cjs')
const SaveItem = require('../entities/save-item.cjs')
const saveRepository = require('../repositories/save-repository.cjs')

class SaveService {
    constructor() {
    }

    async add(originPath, name) {
        const response = new BaseResponse()
        const saveContext = saveRepository.document().data;
        const folder = saveRepository.splitFolderName(originPath);
        const guid = uid();
        const folderLocalSavePath = `./saves/${guid}/1/${folder}`;

        const newSave = new SaveItem(
            `./saves/${guid}`,
            originPath,
            folder,
            await saveRepository.getDirSize(originPath),
            name,
            guid,
            false
        );

        saveContext.push(newSave)

        await fs.promises.mkdir(`./saves/${guid}/1`, { recursive: true });
        await fs.promises.cp(originPath, folderLocalSavePath, { recursive: true })
        await fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));

        response.data = newSave

        return response
    }
    async get() {
        const response = new BaseResponse()
        const saveContext = await Promise.all(saveRepository.document().data
            .map(async (e) => {
                if (fs.existsSync(e.savePathOrigin)) {
                    const sync = e.size == await saveRepository.getDirSize(e.savePathOrigin);

                    return { ...e, sync };
                }
                else {
                    return { ...e, sync: false, folderIsNotFound: true }
                }
            }));

        response.data = {
            list: saveContext,
            hash: saveRepository.hashList(saveRepository.document())
        }

        return response
    }
    async delete(id) {
        const response = new BaseResponse()
        const saveContext = saveRepository.document().data
        const newSaveContext = saveContext.filter(e => e.id != id);
        const save = saveContext.find(e => e.id == id)

        await fs.promises.cp(save.saveLocal, `./trash/${save.id}/${save.saveName}`, { recursive: true });
        await fs.promises.rmdir(`./saves/${save.id}`, { recursive: true });
        await fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));

        return response;
    }
    async sync(id) {
        const response = new BaseResponse()
        const saveContext = saveRepository.document().data;
        const save = saveContext.find(e => e.id == id);
        let newSyncPath;

        if (!fs.existsSync(save.savePathOrigin)) {
            response.addError("Origin folder is not found")

            return response
        }

        const newSaveSize = await saveRepository.getDirSize(save.savePathOrigin);

        if (save.versions) {
            const existingSaves = await fs.promises.readdir(`./saves/${save.id}`);
            const indices = existingSaves
                .map(folder => parseInt(folder))
                .filter(num => !isNaN(num));
            const newIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;

            newSyncPath = `./saves/${save.id}/${newIndex}`;

            await fs.promises.mkdir(newSyncPath, { recursive: true });
        }
        else {
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

        response.data = save

        return response;
    }
    async update(id, data) {
        const response = new BaseResponse()
        const saveContext = saveRepository.document().data;
        const saveIndex = saveContext.findIndex((e) => e.id === id);

        if (saveIndex === -1) {
            response.addError("Item not found")

            return response
        };

        if (fs.existsSync(data.savePathOrigin)) {
            data.folderIsNotFound = false
        }
        else {
            data.folderIsNotFound = true
        }

        const updatedSave = { ...saveContext[saveIndex], ...data };
        saveContext[saveIndex] = updatedSave;

        await fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));

        response.data = updatedSave

        return response;
    }
}

const saveService = new SaveService();

module.exports = saveService;
