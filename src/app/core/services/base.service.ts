import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { enviroment } from "../../../environments/environment";

export abstract class BaseService {
    protected apiUrl = enviroment.apiUrl;

    constructor(protected http: HttpClient) { }

    protected getAll<T>(endpoint: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${endpoint}`)
    }

    protected getByDetail<T>(endpoint: string, id: string): Observable<T> {
        return this.http.get<T>(`${this.apiUrl}/${endpoint}/${id}`)
    }

    protected post<T, U>(endpoint: string, body: U): Observable<T> {
        return this.http.post<T>(`${this.apiUrl}/${endpoint}`, body);
    }

    protected put<T, U>(endpoint: string, body: U, id: string): Observable<T> {
        return this.http.put<T>(`${this.apiUrl}/${endpoint}/${id}`, body);
    }

    protected delete<T>(endpoint: string, id: string): Observable<T> {
        return this.http.delete<T>(`${this.apiUrl}/${endpoint}/${id}`);
    }
}