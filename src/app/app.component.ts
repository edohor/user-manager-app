import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterOutlet } from '@angular/router'
import { UserTableComponent } from './user-table/user-table.component'
import { LoginComponent } from './login/login.component'
import { FormComponent } from './form/form.component'
import { StorageService } from './storage.service'
import { MatButtonModule } from '@angular/material/button'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        UserTableComponent,
        LoginComponent,
        FormComponent,
        MatButtonModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    isLoggedIn: boolean = false
    constructor(private storageService: StorageService) {}

    ngOnInit(): void {
        const initialData = {
            username: 'username',
            password: 'password',
        }
        this.storageService.setData('userData', initialData)

        if (this.storageService.getData('isLoggedIn') != null) {
            this.isLoggedIn = this.storageService.getData('isLoggedIn')
        } else {
            this.storageService.setData('isLoggedIn', 'false')
        }
    }

    receiveDataFromChild(data: boolean): void {
        this.isLoggedIn = data
    }

    logout() {
        this.storageService.setData('isLoggedIn', 'false')
        this.isLoggedIn = false
    }
}
