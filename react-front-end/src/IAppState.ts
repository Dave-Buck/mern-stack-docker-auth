import { IItem } from './models/IItems'

export interface IAppState {
    items: Array<IItem>,
    username: string | undefined
}