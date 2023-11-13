import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'

import { MatButtonModule } from '@angular/material/button'
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { CommonModule } from '@angular/common'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { UserTableComponent } from './user-table/user-table.component'
import { LoginComponent } from './login/login.component'
import { FormComponent } from './form/form.component'

@NgModule({
    declarations: [
        // AppComponent,
        // UserTableComponent,
        // LoginComponent,
        // FormComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        CommonModule,
        RouterModule,
    ],
    providers: [],
    // bootstrap: [AppComponent],
})
export class AppModule {}
