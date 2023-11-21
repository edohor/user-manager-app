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
    mockedData: Array<UserData> = [
        { id: "1", firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', phone: '123-456-7890' },
        { id: "2", firstName: 'Jane', lastName: 'Smith', email: 'jane.smith@example.com', phone: '987-654-3210' },
        { id: "3", firstName: 'Alice', lastName: 'Johnson', email: 'alice.johnson@example.com', phone: '555-123-4567' },
        { id: "4", firstName: 'Bob', lastName: 'Williams', email: 'bob.williams@example.com', phone: '789-012-3456' },
        { id: "5", firstName: 'Eva', lastName: 'Brown', email: 'eva.brown@example.com', phone: '321-654-0987' },
        { id: "6", firstName: 'David', lastName: 'Miller', email: 'david.miller@example.com', phone: '555-555-5555' },
        { id: "7", firstName: 'Sophia', lastName: 'Jones', email: 'sophia.jones@example.com', phone: '777-888-9999' },
        { id: "8", firstName: 'Chris', lastName: 'Clark', email: 'chris.clark@example.com', phone: '111-222-3333' },
        { id: "9", firstName: 'Olivia', lastName: 'Anderson', email: 'olivia.anderson@example.com', phone: '444-444-4444' },
        { id: "10", firstName: 'Michael', lastName: 'White', email: 'michael.white@example.com', phone: '666-777-8888' },
        { id: "11", firstName: 'Emma', lastName: 'Taylor', email: 'emma.taylor@example.com', phone: '999-000-1111' },
        { id: "12", firstName: 'Daniel', lastName: 'Moore', email: 'daniel.moore@example.com', phone: '222-333-4444' },
        { id: "13", firstName: 'Grace', lastName: 'Young', email: 'grace.young@example.com', phone: '555-666-7777' },
        { id: "14", firstName: 'William', lastName: 'Harris', email: 'william.harris@example.com', phone: '888-999-0000' },
        { id: "15", firstName: 'Ava', lastName: 'Martin', email: 'ava.martin@example.com', phone: '111-222-3333' },
        { id: "16", firstName: 'Liam', lastName: 'Cooper', email: 'liam.cooper@example.com', phone: '444-555-6666' },
        { id: "17", firstName: 'Mia', lastName: 'Baker', email: 'mia.baker@example.com', phone: '777-888-9999' },
        { id: "18", firstName: 'Jackson', lastName: 'Fisher', email: 'jackson.fisher@example.com', phone: '111-111-1111' },
        { id: "19", firstName: 'Sophie', lastName: 'Ward', email: 'sophie.ward@example.com', phone: '222-222-2222' },
        { id: "20", firstName: 'Henry', lastName: 'Wright', email: 'henry.wright@example.com', phone: '333-333-3333' },
        { id: "21", firstName: 'Max', lastName: 'Turner', email: 'max.turner@example.com', phone: '444-555-6666' }
      ]
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
        // remove saving mocked data if it's unnecessary
        if (!this.storageService.getData('tableData')) {
            this.storageService.setData('tableData', this.mockedData)            
        }
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
