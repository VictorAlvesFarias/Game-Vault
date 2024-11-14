import { WatchEventType } from 'fs';
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

    ) { }
}

export class SaveService {
    public counter: number = 0

    public async add(originPath: string, name: string) {
        const saveContext = this.document();
        const folder = this.splitFolderName(originPath);
        const guid = uid();
        
        // Define o caminho da pasta inicial com índice 1
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
        await window.node.fs.promises.mkdir(`./saves/${guid}/1`, { recursive: true });
        await window.node.fs.promises.cp(originPath, folderLocalSavePath, { recursive: true });
        
        await window.node.fs.promises.writeFile('./saves/save.json', JSON.stringify(saveContext));
    }
    public async get(): Promise<SaveItem[]> {
        try {
            let saveContext:Promise<SaveItem>[] = this.document().map(async (e: SaveItem) => {
                const sync = e.size == await this.getDirSize(e.savePathOrigin);
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
                size += await this.getDirSize(filePath);
            }
            else {
                const file = await window.node.fs.promises.stat(filePath);
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
    public async sync(id: string) {
        const saveContext = this.document();
        const save: SaveItem = this.getById(id);
        const newSaveSize = await this.getDirSize(save.savePathOrigin);
        const existingSaves = await window.node.fs.promises.readdir(`./saves/${save.id}`);
        const indices = existingSaves
            .map(folder => parseInt(folder))
            .filter(num => !isNaN(num)); 
    
        const newIndex = indices.length > 0 ? Math.max(...indices) + 1 : 1;
        const newSyncPath = `./saves/${save.id}/${newIndex}`;
    
        // Cria a nova pasta e copia o conteúdo atualizado
        await window.node.fs.promises.mkdir(newSyncPath, { recursive: true });
        await window.node.fs.promises.cp(save.savePathOrigin, `${newSyncPath}/${save.saveName}`, { recursive: true });
    
        const newSaveContext = saveContext.map((e) => {
            if (e.id === id) {
                e.size = newSaveSize;
                e.sync = true;
            }
            return e;
        });
    
        await window.node.fs.promises.writeFile('./saves/save.json', JSON.stringify(newSaveContext));
    
        return save;
    }    
    public fileChanged(saveItem: SaveItem, callback: (e: WatchEventType) => any) {
        window.node.fs.watch(saveItem.savePathOrigin, (event) => {
            if (event === 'change') {
                callback(event);
            }
        });
    }
}

const saveService = new SaveService();

export default saveService;
