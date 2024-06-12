import { Guid } from 'js-guid'

export class SaveItem {
    constructor(
        public saveLocal: string,
        public savePathOrigin: string,
        public saveName: string,
        public size: string,
    ) { }
}

export default class SaveService {
    public async add(path) {
        const saveContext = this.document()
        const folder = this.getFolderName(path)
        const saveItem: SaveItem = this.getByPath(path)

        if (saveItem != null) {
            throw "Essa pasta ja possui um backup"
        }
        else {
            const newSave = new SaveItem(
                './saves/' + folder,
                path,
                folder,
                String(this.getDirSize(path))
            )
            saveContext.push(newSave)
        }

        window.node.fs.cpSync(path, './saves/' + folder, { recursive: true })
        window.node.fs.writeFileSync('./saves/save.json', JSON.stringify(saveContext))
    }

    public async get(): Promise<any> {
        const result = new Promise((resolve, reject) => {
            try {
                let saveContext = this.document().map(e=>{
                    
                    return {...e,sync:e.size==this.getDirSize(e.savePathOrigin)}
                })

                return resolve(saveContext)
            } catch (error) {
                return reject(error)
            }
        })

        return result
    }

    public async getStats(path) {
        const result = new Promise((resolve, reject) => {
            try {
                const result = window.node.fs.statSync(path)
                resolve(result)
            } catch (error) {
                reject('eita')
            }
        });

        return result
    }

    public async delete(path) {
        const newSaveContext = this.document().filter(e => e.saveLocal != path)
        window.node.fs.rmdirSync(path,{recursive:true})
        window.node.fs.writeFileSync('./saves/save.json', JSON.stringify(newSaveContext))
        return newSaveContext
    }

    private getDirSize(dirPath):number {
        let size = 0;
        const files = window.node.fs.readdirSync(dirPath);

        for (let i = 0; i < files.length; i++) {
            const filePath = dirPath + '/' + files[i];
            const stats = window.node.fs.statSync(filePath);

            try {
                window.node.fs.readFileSync(filePath)
                size += stats.size;
            } catch (error) {
                try {
                    window.node.fs.readdirSync(filePath)
                    size += this.getDirSize(filePath)
                } catch (error) {
                }
            }
        }

        return size;
    };

    private document(): SaveItem[] {
        let saveContext = JSON.parse(
            window.node.fs.existsSync('./saves/save.json')? 
                window.node.fs.readFileSync('./saves/save.json', "utf-8")
            :
            'null'
        )??[]

        return saveContext
    }

    private getByPath(path) {
        const result = this.document()?.filter(e => e.savePathOrigin == path)[0]

        return result
    }

    private getFolderName(path) {
        const result = path.split('\\')[path.split('\\').length - 1]

        return result
    }
}
