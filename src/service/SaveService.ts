class SaveItem 
{
    constructor(
        public saveLocal:string,
        public savePathOrigin:string
    ) {}
}

export default class SaveService 
{
    public async addSave(path) 
    {
        const folder = path.split('\\')[path.split('\\').length-1]
        await application.replaceFolder(path,'./saves/'+folder)
        await application.writeFileAsync("./saves/save.json","[]")
    }
}

