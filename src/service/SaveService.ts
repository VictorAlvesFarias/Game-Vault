
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
        let saveContext

        try {
            saveContext = JSON.parse(window.fs.readFileSync('./saves/save.json', "utf-8") ?? "[]")
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
                '0'
            )
            saveContext.push(newSave)
        }

        window.fs.cpSync(path, './saves/' + folder)
        window.fs.writeFileSync('./saves/save.json', JSON.stringify(saveContext))
    }

    public async getSaves() {
        let saveContext
    
        try {
            saveContext = JSON.parse(window.fs.readFileSync('./saves/save.json', "utf-8") ?? "[]")
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
