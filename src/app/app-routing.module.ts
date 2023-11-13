import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './login/login.component'
import { UserTableComponent } from './user-table/user-table.component'
import { FormComponent } from './form/form.component'

const routes: Routes = [
    { path: '', redirectTo: '/list', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'list', component: UserTableComponent },
    { path: 'add', component: FormComponent },
    { path: 'edit', component: FormComponent },
    { path: '**', redirectTo: '/list' },
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
