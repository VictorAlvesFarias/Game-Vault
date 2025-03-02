const { v4: uid } = require('uuid');
const fs = require('fs');
const { response } = require('express');
const crypto = require('crypto');
const BaseResponse = require('../entities/base-response.cjs')
const Event = require('../entities/event.cjs')
const SaveItem = require('../entities/save-item.cjs')

class SaveRepository {
    constructor() {
        this.subscriptions = [];
    }

    async getDirSize(dirPath) {
        let size = 0;
        const files = await fs.promises.readdir(dirPath);

        for (let file of files) {
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
    folderExist(path) {
        let response = new BaseResponse()

        response.data = fs.existsSync(path)

        return response
    }
    document() {
        const response = new BaseResponse()
        let saveContext = JSON.parse(
            fs.existsSync('./saves/save.json') ?
                fs.readFileSync('./saves/save.json', "utf-8")
                :
                'null'
        ) ?? [];

        response.data = saveContext

        return response;
    }
    splitFolderName(path) {
        const result = path.split('\\')[path.split('\\').length - 1];
        return result;
    }
    setWatcherEvent(folderPath, callback) {
        if (fs.existsSync(folderPath)) {
            const watchers = this.subscriptions.filter(e => e.path);

            if (watchers.length > 0) {
                watchers.forEach(e => {
                    e.watcher.close()
                });
            }

            this.subscriptions = this.subscriptions.filter(e => !watchers.some(s => s.path === e.path));

            const watcher = fs.watch(folderPath, (event) => {
                callback(event);
            });

            const event = new Event(watcher, folderPath);

            this.subscriptions.push(event);
        }
    }
    hashList(list) {
        const listString = JSON.stringify(list);
        const hash = crypto.createHash('sha256').update(listString).digest('hex');

        return hash;
    }
}

const saveRepository = new SaveRepository();

module.exports = saveRepository;
