import { BaseService, Route } from './base-service';
import { IBaseResponse } from '../interfaces/shared/base-response-api';
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
    folderIsNotFound: boolean
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

        const result = await this.post<ISaveItem>({
            api: env,
            href: '/add',
            params: {}
        }, saveItem);

        return result;
    }

    public async getPath() {
        const path = await window.node.dialog.showOpenDialog({ properties: ['openDirectory'] })
            .then(e => e.filePaths[0]);

        return path
    }

    public async getSaves() {
        const result = await this.get<IBaseResponse<{ list: ISaveItem[], hash: string }>>({
            api: env,
            href: '/get-documents',
            params: {}
        });

        return result;
    }

    public async deleteSave(id: string) {
        const result = await this.delete<null>({
            api: env,
            href: `/delete/${id}`,
            params: {}
        });

        return result;
    }

    public async syncSave(id: string) {
        const result = await this.post<ISaveItem>({
            api: env,
            href: `/sync/${id}`,
            params: {}
        }, {});

        return result;
    }

    public async updateSave(id: string, data: Partial<ISaveItem>) {
        const result = await this.put<IBaseResponse<ISaveItem>>({
            api: env,
            href: `/update/${id}`,
            params: {}
        }, data);

        return result;
    }
}

const saveService = new SaveService();

export default saveService;
