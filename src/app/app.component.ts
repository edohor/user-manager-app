import { Component, OnInit, OnDestroy } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { UserTableComponent } from './user-table/user-table.component'
import { LoginComponent } from './login/login.component'
import { FormComponent } from './form/form.component'
import { StorageService } from './storage.service'
import { MatButtonModule } from '@angular/material/button'
import { Router } from '@angular/router'
import { DataService } from './data.service'
import { Subscription } from 'rxjs'

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        UserTableComponent,
        LoginComponent,
        FormComponent,
        MatButtonModule,
    ],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    isLoggedIn: boolean = false
    isAddMode: boolean = false
    isEditMode: boolean = false
    private dataSubscription!: Subscription
    constructor(
        private storageService: StorageService,
        private router: Router,
        private dataService: DataService,
    ) {}

    ngOnInit(): void {
        const initialData = {
            username: 'username',
            password: 'password',
        }
        this.storageService.setData('userData', initialData)

        if (this.storageService.getData('isLoggedIn') != null) {
            this.isLoggedIn =
                this.storageService.getData('isLoggedIn') === 'false'
                    ? false
                    : true
        } else {
            this.storageService.setData('isLoggedIn', 'false')
        }
        this.dataSubscription = this.dataService.data$.subscribe((data) => {
            if (data) {
                this.changeLoginStatus(data)
            }
        })

        if (this.isLoggedIn) {
            this.router.navigate(['/list'])
        } else {
            this.router.navigate(['/login'])
        }
    }

    ngOnDestroy() {
        this.dataSubscription.unsubscribe()
    }

    changeLoginStatus(data: boolean): void {
        this.isLoggedIn = data
        this.storageService.setData('isLoggedIn', data.toString())
        if (data) {
            this.router.navigate(['/list'])
        }
    }

    logout() {
        this.isLoggedIn = false
        this.storageService.setData('isLoggedIn', 'false')
        this.router.navigate(['/login'])
    }
}
