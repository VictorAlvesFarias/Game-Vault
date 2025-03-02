export interface IBaseResponse<T> {
    errors: any
    sucess: boolean
    pages: number
    currentPage: number
    data: T
}
