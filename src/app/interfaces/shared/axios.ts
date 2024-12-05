import { AxiosResponse } from "axios";

export interface IAxios<T> extends AxiosResponse<T,any> {

}