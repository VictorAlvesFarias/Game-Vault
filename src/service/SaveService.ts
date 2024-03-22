import { readdirSync } from "original-fs"

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
        // const saveContext = await this.getSaves()
        // const folder = path.split('\\')[path.split('\\').length - 1]
        // const saveItem: SaveItem = saveContext?.filter((x: SaveItem) => x?.saveLocal == './saves/' + folder)[0]

        // if (saveItem != null) {
        //     const index = saveContext.indexOf(saveItem)
        //     saveContext[index] = saveItem    
        // }

        // else {
        //     const newSave = new SaveItem(
        //         './saves/' + folder,
        //         path,
        //         folder,
        //         '0'
        //     )
        //     saveContext.push(newSave)
        // }

        // window.node.fs.cpSync(path, './saves/' + folder)
        // window.node.fs.writeFileSync('./saves/save.json', JSON.stringify(saveContext))
    }

    public async getSaves(): Promise<any> {
        const result = new Promise((resolve, reject) => {
            try {
                let saveContext

                saveContext = JSON.parse(
                    window.node.fs.existsSync('./saves/save.json') ?
                        window.node.fs.readFileSync('./saves/save.json', "utf-8")
                        :
                        "[]"
                )
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

    public getDirSize = (dirPath) => {
        let size = 0;
        const files = window.node.fs.readdirSync(dirPath);

        console.log(files)

        for (let i = 0; i < files.length; i++) {

            console.log(window.node.path)

            const filePath = dirPath+'/'+ files[i];

            console.log(filePath)

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
}
