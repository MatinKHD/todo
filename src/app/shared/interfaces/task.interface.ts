import { ListInterface } from "./list.interface";

export interface TaskInterface {
    id: string,
    title:string, 
    description: string, 
    done: boolean, 
    date: Date, 
    list: ListInterface
}