import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SelectionModel } from '@angular/cdk/collections'
import { StorageService } from '../storage.service'
import { MatButtonModule } from '@angular/material/button'
import { Router } from '@angular/router'

export interface UserData {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
}

@Component({
    selector: 'app-user-table',
    templateUrl: './user-table.component.html',
    styleUrls: ['./user-table.component.scss'],
    standalone: true,
    imports: [CommonModule, MatButtonModule],
})
export class UserTableComponent {
    @Input() dataSource: Array<UserData> = []
    selectedRows: SelectionModel<UserData>
    isEditButtonDisabled: boolean = true
    isDeleteButtonDisabled: boolean = true

    constructor(
        private storageService: StorageService,
        private router: Router,
    ) {
        this.selectedRows = new SelectionModel<UserData>(true, [])
        this.getData()
        this.selectedRows.changed.subscribe(() => {
            this.updateButtonStates()
        })
    }

    getData() {
        const storedData = this.storageService.getData('tableData')
        if (storedData) {
            this.dataSource = storedData
        }
    }

    updateButtonStates() {
        this.isEditButtonDisabled = this.selectedRows.selected.length !== 1
        this.isDeleteButtonDisabled = this.selectedRows.selected.length === 0
    }

    masterToggle() {
        this.isAllSelected()
            ? this.selectedRows.clear()
            : this.dataSource.forEach((row) => this.selectedRows.select(row))
    }

    isAllSelected() {
        const numSelected = this.selectedRows.selected
            .length as unknown as number
        const numRows = this.dataSource.length
        return numSelected === numRows
    }

    selectionToggle(row: UserData) {
        this.selectedRows.toggle(row)
    }

    isSelected(row: UserData) {
        return this.selectedRows.isSelected(row)
    }

    editRow(rowData?: UserData) {
        const selectedRow = rowData ? rowData : this.selectedRows.selected[0]
        if (selectedRow) {
            const allUsers: UserData[] =
                this.storageService.getData('tableData') || []

            const foundUser = allUsers.find(
                (user) => user.id === selectedRow.id,
            )
            if (foundUser) {
                this.router.navigate(['/edit'], {
                    state: { selectedRow: foundUser },
                })
            }
        }
    }

    deleteRow(rowToDelete: UserData) {
        if (rowToDelete) {
            const allUsers: UserData[] =
                this.storageService.getData('tableData') || []
            const updatedUsers = allUsers.filter(
                (user) => user.id !== rowToDelete.id,
            )

            this.storageService.setData('tableData', updatedUsers)
            this.getData()
        }
    }

    addUser() {
        this.router.navigate(['/add'])
    }

    deleteUsers() {
        const selectedData = this.selectedRows.selected
        const allUsers: UserData[] =
            this.storageService.getData('tableData') || []

        selectedData.forEach((row: UserData) => {
            const index = allUsers.findIndex((item) => item.id === row.id)
            if (index > -1) {
                allUsers.splice(index, 1)
            }
        })

        this.storageService.setData('tableData', allUsers)
        this.getData()
        this.selectedRows.clear()
    }
}
