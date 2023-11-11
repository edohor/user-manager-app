import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { UserTableComponent } from './user-table/user-table.component'
import { MatIconModule } from '@angular/material/icon'

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatTableModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule,
    ],
    declarations: [UserTableComponent],
    bootstrap: [],
})
export class AppModule {}
