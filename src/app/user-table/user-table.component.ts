import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SelectionModel } from '@angular/cdk/collections'
import { StorageService } from '../storage.service'
import { MatButtonModule } from '@angular/material/button'
import { Router } from '@angular/router'
import { MatTableModule } from '@angular/material/table'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatIconModule } from '@angular/material/icon'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatPaginatorModule } from '@angular/material/paginator'

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
    imports: [
        CommonModule,
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatIconModule,
        FormsModule,
        MatInputModule,
        MatPaginatorModule,
    ],
})
export class UserTableComponent {
    dataSource: Array<UserData> = []
    filteredDataSource: Array<UserData> = []
    displayingDataSource: Array<UserData> = []
    selectedRows: SelectionModel<UserData>
    isEditButtonDisabled: boolean = true
    isDeleteButtonDisabled: boolean = true
    displayedColumns: string[] = [
        'select',
        'firstName',
        'lastName',
        'email',
        'phone',
        'actions',
    ]
    pageSizeOptions: number[] = [5, 10, 20]
    pageSize: number = 5
    pageIndex: number = 0
    length: number = 0
    filterValue: string = ''

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
            this.length = storedData.length
            this.onPageUpdate(
                {
                    pageIndex: this.pageIndex,
                    pageSize: this.pageSize,
                    length: this.length,
                    previousPageIndex: 0,
                },
                this.dataSource,
            )
        }
    }

    updateButtonStates() {
        this.isEditButtonDisabled = this.selectedRows.selected.length !== 1
        this.isDeleteButtonDisabled = this.selectedRows.selected.length === 0
    }

    masterToggle() {
        const data = this.displayingDataSource.length
            ? this.displayingDataSource
            : this.dataSource
        this.isAllSelected()
            ? this.selectedRows.clear()
            : data.forEach((row) => this.selectedRows.select(row))
    }

    isAllSelected() {
        const numSelected = this.selectedRows.selected
            .length as unknown as number
        const numRows = this.displayingDataSource.length
            ? this.displayingDataSource.length
            : this.dataSource.length
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

    onPageUpdate(event: any, data?: Array<UserData>) {
        this.selectedRows.clear()
        this.pageIndex = event.pageIndex
        this.pageSize = event.pageSize

        const startIndex = this.pageIndex * this.pageSize
        const endIndex = startIndex + this.pageSize

        this.displayingDataSource = this.filteredDataSource.length
            ? this.filteredDataSource.slice(startIndex, endIndex)
            : this.dataSource.slice(startIndex, endIndex)
    }

    applyFilter(event: Event) {
        this.filterValue = (event.target as HTMLInputElement).value
        const filteredData = this.dataSource.filter((item) => {
            return (
                item.firstName.toLowerCase().includes(this.filterValue) ||
                item.lastName.toLowerCase().includes(this.filterValue) ||
                item.email.toLowerCase().includes(this.filterValue) ||
                item.phone.includes(this.filterValue)
            )
        })

        this.filteredDataSource = filteredData
        this.length = this.filteredDataSource.length

        this.onPageUpdate(
            {
                pageIndex: 0,
                pageSize: this.pageSize,
                length: this.length,
                previousPageIndex: 0,
            },
            this.filteredDataSource,
        )
    }
}
