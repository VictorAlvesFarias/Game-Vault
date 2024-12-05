import { BaseService, Route } from './base-service';
import { IBaseResponseApi } from '../interfaces/shared/base-response-api';
import { IAxios } from '../interfaces/shared/axios';
import { AxiosRequestConfig } from 'axios';
import { env } from '../environment';

export interface ISaveItem {
    saveLocal: string;
    savePathOrigin: string;
    saveName: string;
    size: number;
    name: string;
    id: string;
    sync?: boolean;
    versions?: any;
    saveWithRachChange?: any;
}

export interface ISaveServiceResponse<T> {
    res: T;
    pages: number;
    currentPage: number;
}

export class SaveService extends BaseService {

    constructor(config?: AxiosRequestConfig, token?: any) {
        super(config, token);
    }

    public async addSave(saveItem: Partial<ISaveItem>) {
        saveItem.savePathOrigin = await window.node.dialog.showOpenDialog({ properties: ['openDirectory'] })
            .then(e => e.filePaths[0]);

        const result = this.post<ISaveItem>({
            api: env,
            href: '/add',
            params: {}
        }, saveItem);

        return result;
    }

    public getSaves() {
        const result = this.get<ISaveItem[]>({
            api: env,
            href: '/get-documents',
            params: {}
        });

        return result;
    }

    public deleteSave(id: string) {
        const result = this.delete<null>({
            api: env,
            href: `/delete/${id}`,
            params: {}
        });

        return result;
    }

    public syncSave(id: string) {
        const result = this.post<ISaveItem>({
            api: env,
            href: `/sync/${id}`,
            params: {}
        },{});

        return result;
    }

    public updateSave(id: string, data: Partial<ISaveItem>) {
        const result = this.put<ISaveItem>({
            api: env,
            href: `/update/${id}`,
            params: {}
        }, data);

        return result;
    }

    public getSaveById(id: string) {
        const result = this.get<ISaveItem>({
            api: env,
            href: `/get/${id}`,
            params: {}
        });

        return result;
    }
}

const saveService = new SaveService();

export default saveService;
