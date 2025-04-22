import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class LocalRepository {
    private isInBrowser: boolean;
    private isLocalStorageSupported: boolean;

    constructor(
        @Inject(PLATFORM_ID) private platformId: string,
        @Inject(DOCUMENT) private _document: Document,
    ) {
        this.isInBrowser = isPlatformBrowser(this.platformId);
        this.isLocalStorageSupported = typeof (localStorage) !== "undefined";
    }

    public get IsInBrowser(): boolean {
        return this.isInBrowser;
    }

    public document(): Document {
        return this._document;
    }

    public window(): (Window & typeof globalThis) {
        return this._document.defaultView!;
    }


    /**
     * @param key for reference to date
     * @param value data to be stored
     */
    public setItem(key: string, value: string) {
        if (this.isInBrowser && this.isLocalStorageSupported)
            localStorage.setItem(key, value);
    }

    /**
   * @param key for reference key to retrive value
   */
    public getItem(key: string) {
        return (this.isInBrowser && this.isLocalStorageSupported)
            ? localStorage.getItem(key)
            : null;
    }

    /**
  * get data from localStorage by taking care of SSR
  * @param key for reference key to retrive value
  */
    public getItemJson<T>(key: string): T | null {
        return (this.isInBrowser && this.isLocalStorageSupported)
            ? JSON.parse(localStorage.getItem(key)!) as T
            : null;
    }

    /**
    * Clear local Storage
    */
    public clear() {
        if (this.isInBrowser && this.isLocalStorageSupported)
            localStorage.clear();
    }

    /**
    * Clear given kyes from local Storage
    */
    public clearItems(keys: string[]) {
        if (this.isInBrowser && this.isLocalStorageSupported){
            for (const key of keys) {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                }
                else
                    continue;
            }
        }
    }

    /**
     * remove from local Storage
     * @param key for reference key to remove value
     */
    public remove(key: string) {
        if (this.isInBrowser && this.isLocalStorageSupported)
            localStorage.removeItem(key);
    }
}
