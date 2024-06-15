import { v4 as uid } from 'uuid';

export class SaveItem {
    constructor(
        public saveLocal: string,
        public savePathOrigin: string,
        public saveName: string,
        public size: number,
        public name: string,
        public id: string,
        public sync?: boolean | undefined,
        public loading?: boolean | undefined
    ) { }
}

export class SaveService {
    public counter: number = 0

    public async add(originPath, name) {
        const saveContext = this.document();
        const folder = this.splitFolderName(originPath);
        const guid = uid()
        const folderLocalSavePath = `./saves/${guid}/${folder}`
        const newSave = new SaveItem(
            folderLocalSavePath,
            originPath,
            folder,
            await this.getDirSize(originPath), // Aguarde a obtenção do tamanho
            name,
            guid
        );

        saveContext.push(newSave);
        await window.node.fs.promises.cp(originPath, folderLocalSavePath, { recursive: true });
        await window.node.fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));
    }

    public async get(): Promise<SaveItem> {
        try {
            let saveContext = this.document().map(async (e: any) => {
                const sync = e.size == await this.getDirSize(e.savePathOrigin);
                // console.log(await this.getDirSize(e.savePathOrigin))
                // console.log(e.size)
                // console.log(e)
                // console.log('---------------------------')
                return { ...e, sync };
            });

            return Promise.all(saveContext);
        } catch (error) {
            throw error;
        }
    }

    public async delete(id) {
        const newSaveContext = this.document().filter(e => e.id != id);
        const save = this.getById(id);

        await window.node.fs.promises.cp(save.saveLocal, `./trash/${save.id}/${save.saveName}`, { recursive: true });
        await window.node.fs.promises.rmdir(`./saves/${save.id}`, { recursive: true });
        await window.node.fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));

        return newSaveContext;
    }

    private async getDirSize(dirPath): Promise<number> {
        let size = 0;
        const files = await window.node.fs.promises.readdir(dirPath);

        for (let file of files) {
            this.counter++
            const filePath = dirPath + '/' + file;

            if (await window.node.isDirectory(filePath)) {
                size += await this.getDirSize(filePath)
            }
            else {
                const file = await window.node.fs.promises.stat(filePath)
                size += file.size;
            }
        }
        return size;
    }

    private document(): SaveItem[] {
        let saveContext = JSON.parse(
            window.node.fs.existsSync('./saves/save.json') ?
                window.node.fs.readFileSync('./saves/save.json', "utf-8")
                :
                'null'
        ) ?? [];

        return saveContext;
    }

    private getById(id) {
        const result = this.document()?.filter(e => e.id == id)[0];
        return result;
    }

    private splitFolderName(path) {
        const result = path.split('\\')[path.split('\\').length - 1];
        return result;
    }

    public selectFolder() {
        return window.node.dialog.showOpenDialog({ properties: ['openDirectory'] });
    }

    public async sync(id){
        const saveContext = this.document();
        const save: SaveItem = this.getById(id);
        const newSaveSize = await this.getDirSize(save.savePathOrigin)
        const newSaveContext = saveContext.map((e) => {
            if (e.id === id) {
                e.size = newSaveSize;
            }
            console.log(e);
            return e;
        })
        if(save !=null){
            save.size = newSaveSize
            save.sync = true
            await this.delete(save.id)
            await window.node.fs.promises.cp(save.savePathOrigin, `./saves/${save.id}/${save.saveName}`, { recursive: true });
            await window.node.fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));
        }
        return save  
    }
}

const saveService = new SaveService()

export default saveService 