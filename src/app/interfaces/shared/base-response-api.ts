export interface IBaseResponseApi<T> {
    errors: any
    sucess: boolean
    pages: number
    currentPage: number
    data: T
}