import { Component, Input } from '@angular/core'
import { MatTableDataSource } from '@angular/material/table'
import { SelectionModel } from '@angular/cdk/collections'
import { MatIconRegistry } from '@angular/material/icon'
import { DomSanitizer } from '@angular/platform-browser'

export interface UserData {
    name: string
    lastName: string
    email: string
    phoneNumber: string
}

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent {
    @Input() data: UserData[] = []
    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSanitizer: DomSanitizer,
    ) {
        this.matIconRegistry.addSvgIcon(
            'edit',
            this.domSanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'),
        )
        this.matIconRegistry.addSvgIcon(
            'delete',
            this.domSanitizer.bypassSecurityTrustResourceUrl(
                'assets/delete.svg',
            ),
        )
    }

    displayedColumns: string[] = [
        'select',
        'name',
        'lastName',
        'email',
        'phoneNumber',
        'actions',
    ]
    dataSource = new MatTableDataSource<UserData>(this.data)
    selection = new SelectionModel<UserData>(true, [])

    masterToggle() {
        // Logic for selecting/deselecting all rows
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row))
    }

    isAllSelected() {
        // Logic to check if all rows are selected
        const numSelected = this.selection.selected.length
        const numRows = this.dataSource.data.length
        return numSelected === numRows
    }

    editRow(row: UserData) {
        // Logic to edit a row
    }

    deleteRow(row: UserData) {
        // Logic to delete a row
    }
}
