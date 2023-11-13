import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ReactiveFormsModule } from '@angular/forms'
import { StorageService } from '../storage.service'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'

interface FormErrors {
    [key: string]: string | null
}

interface ValidationMessages {
    [key: string]: { [key: string]: string }
}

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
}

@Component({
    selector: 'app-form',
    standalone: true,
    imports: [
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule,
    ],
    templateUrl: './form.component.html',
    styleUrl: './form.component.scss',
})
export class FormComponent {
    userForm: FormGroup
    selectedRow: any
    userId: string = ''

    formErrors: FormErrors = {
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
    }

    validationMessages: ValidationMessages = {
        firstName: {
            required: 'First name is required.',
        },
        lastName: {
            required: 'Last name is required.',
        },
        email: {
            required: 'Email is required.',
            email: 'Enter a valid email address.',
        },
        phone: {
            pattern: 'Enter a valid phone number.',
        },
    }

    constructor(
        private formBuilder: FormBuilder,
        private storageService: StorageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.userForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
        })

        this.route.paramMap.subscribe((params) => {
            this.selectedRow = history.state.selectedRow
            this.userId = history.state.selectedRow.id
            this.populateFormFields()
        })
    }

    ngOnInit() {
        this.userForm.valueChanges.subscribe(() => {
            this.onValueChanged()
        })
    }

    onSubmit() {
        if (this.userForm.valid) {
            let userData = this.userForm.value
            userData.id = this.userId
            this.addUserToList(userData)
            this.router.navigate(['/list'])
        } else {
            this.validateForm()
            this.onValueChanged()
        }
    }

    addUserToList(newUser: User): void {
        let allUsers: User[] = this.storageService.getData('tableData') || []
        const existingUserIndex = allUsers.findIndex(
            (user) => user.id === newUser.id,
        )

        if (existingUserIndex !== -1) {
            // If the user already exists, replace their data with the new data
            allUsers[existingUserIndex] = newUser
        } else {
            // If it's a new user (which shouldn't happen during editing), add them to the array
            newUser.id = this.generateNextAvailableId(allUsers)
            allUsers.push(newUser)
        }

        this.storageService.setData('tableData', allUsers)
    }

    generateNextAvailableId(allUsers: User[]): string {
        // Find the maximum ID in the array
        const maxId = allUsers.reduce((max, user) => {
            const userId = parseInt(user.id)
            return userId > max ? userId : max
        }, 0)

        // Increment the max ID by 1 to get the next available ID
        return (maxId + 1).toString()
    }

    onValueChanged() {
        if (!this.userForm) {
            return
        }
        this.validateForm()
    }

    validateForm() {
        for (const field in this.formErrors) {
            if (Object.prototype.hasOwnProperty.call(this.formErrors, field)) {
                this.formErrors[field] = null
                const control = this.userForm.get(field)

                if (control && control.invalid && control.touched) {
                    const messages = this.validationMessages[field]
                    for (const key in control.errors) {
                        if (
                            Object.prototype.hasOwnProperty.call(
                                control.errors,
                                key,
                            ) &&
                            messages[key]
                        ) {
                            this.formErrors[field] = messages[key]
                            break
                        }
                    }
                }
            }
        }
    }

    returnToTableView() {
        this.router.navigate(['/list'])
    }

    populateFormFields() {
        if (this.selectedRow) {
            this.userForm.patchValue({
                id: this.selectedRow.id,
                firstName: this.selectedRow.firstName,
                lastName: this.selectedRow.lastName,
                email: this.selectedRow.email,
                phone: this.selectedRow.phone,
            })
        }
    }
}
