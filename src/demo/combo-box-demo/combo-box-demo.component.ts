import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ComboBoxComponent } from '../../components/combo-box/combo-box.component';
import { Data } from '../../test-data';

@Component({
    selector: 'combo-box-demo',
    styleUrls: ['./combo-box-demo.component.scss'],
    templateUrl: './combo-box-demo.component.html'
})
export class ComboBoxDemoComponent implements AfterViewInit {
    private countries: any[];
    private customers: any[];

    @ViewChild(ComboBoxComponent)
    public comboBox: ComboBoxComponent;

    constructor() {
        this.countries = Data.CountriesJson;
        this.customers = Data.Customers.slice(0,100);
    }

    public ngAfterViewInit(): void {
        this.comboBox.displayMember = 'name';
        this.comboBox.items = Data.CountriesJson;
        this.comboBox.valueMember = 'id';
    }

    private getCustomerName(customer: any): string {
        return `${customer.firstName} ${customer.lastName}`;
    }
}