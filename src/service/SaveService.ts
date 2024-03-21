export class SaveItem {
    constructor(
        public saveLocal: string,
        public savePathOrigin: string,
        public saveName: string,
        public size: string
    ) { }
}

export default class SaveService {
    public async addSave(path) {
        return (
            new Promise((resolve, reject) => {
                try {
                    let saveContext

                    try {
                        saveContext = JSON.parse(application.getFile('./saves/save.json', "utf-8") ?? "[]")
                    }

                    catch (error) {
                        saveContext = JSON.parse("[]")
                    }

                    const folder = path.split('\\')[path.split('\\').length - 1]
                    const saveItem: SaveItem = saveContext?.filter((x: SaveItem) => x?.saveLocal == './saves/' + folder)[0]

                    if (saveItem != null) {
                        const index = saveContext.indexOf(saveItem)
                        saveContext[index] = saveItem
                    }

                    else {
                        const newSave = new SaveItem(
                            './saves/' + folder,
                            path,
                            folder,
                            0
                        )
                        saveContext.push(newSave)
                    }

                    application.replaceFolder(path, './saves/' + folder)
                    application.writeFile('./saves/save.json', JSON.stringify(saveContext))
                    
                    return resolve("ok")
                }

                catch (error) {
                    return reject("Ocorreu algum erro")
                }
            })
        )
    }

    public async getSaves() {
        let saveContext

        try {
            saveContext = JSON.parse(application.getFile('./saves/save.json', "utf-8") ?? "[]")
        }

        catch (error) {
            saveContext = JSON.parse("[]")
        }

        return (
            new Promise((resolve, reject) => {
                return resolve(saveContext)
            })
        )
    }
}

