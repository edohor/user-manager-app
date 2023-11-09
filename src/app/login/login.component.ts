import { Component, OnInit, EventEmitter, Output } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { StorageService } from '../storage.service'

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
    @Output() loginStatus = new EventEmitter<boolean>()

    constructor(private storageService: StorageService) {}

    username: string = ''
    password: string = ''
    usernameValidationMessage: string = ''
    passwordValidationMessage: string = ''
    storedData: any

    ngOnInit(): void {
        this.storedData = this.storageService.getData('userData')
    }

    changeLoginStatus(): void {
        const data = true
        this.loginStatus.emit(data)
    }

    validateInput() {
        if (!this.username) {
            this.usernameValidationMessage = 'Username is required.'
        } else if (this.username !== this.storedData.username) {
            this.usernameValidationMessage = "Username doesn't exist."
        } else {
            this.usernameValidationMessage = ''
        }

        if (!this.password) {
            this.passwordValidationMessage = 'Password is required.'
        } else if (this.password !== this.storedData.password) {
            this.passwordValidationMessage = 'Password is incorrect'
        } else {
            this.passwordValidationMessage = ''
        }

        if (
            this.usernameValidationMessage === '' &&
            this.passwordValidationMessage === ''
        ) {
            this.changeLoginStatus()
        }
    }
}
