import { ListInterface } from "./list.interface";

export interface TaskInterface {
    _id: string,
    title:string, 
    description: string, 
    done: boolean, 
    date: Date | string, 
    list: ListInterface
}

export type CreateTask = Omit<TaskInterface, '_id'>;