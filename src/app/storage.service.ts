import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    setData(key: string, data: any): void {
        localStorage.setItem(key, JSON.stringify(data))
    }

    getData(key: string): any {
        const storedData = localStorage.getItem(key)
        return storedData ? JSON.parse(storedData) : null
    }
}
