import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ComboBoxComponent } from '../../components/combo-box/combo-box.component';
import { Data } from '../../test-data';

import * as componentTemplate from "./combo-box-demo.component.html";
import * as componentStyles from "./combo-box-demo.component.scss";

@Component({
    selector: 'combo-box-demo',
    template: componentTemplate,
    styles: [componentStyles]
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