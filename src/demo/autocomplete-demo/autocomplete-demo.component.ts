import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { AutocompleteComponent } from '../../components/autocomplete/autocomplete.component';
import { Data } from '../../test-data';

@Component({
    selector: 'autocomplete-demo',
    styleUrls: ['./autocomplete-demo.component.scss'],
    templateUrl: './autocomplete-demo.component.html'
})
export class AutocompleteDemoComponent implements AfterViewInit {

    private items: any[] = [];
    private customers: any[];
    private selectedItem: any = null;

    @ViewChild(AutocompleteComponent)
    public autocomplete: AutocompleteComponent;

    constructor() {
        this.customers = Data.Customers;
    }

    public ngAfterViewInit(): void {
        this.autocomplete.displayMember = "name";
        this.autocomplete.items = Data.CountriesJson;
    }

    private getCustomerName(customer: any): string {
        return `${customer.firstName} ${customer.lastName}`;
    }

    private remoteDatasource(searchText: string, limit: number): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (searchText == undefined) {
                    resolve(Data.CountriesJson.slice(0, 10));
                    return;
                }

                searchText = searchText.toLowerCase();
                resolve(Data.CountriesJson.filter(x => x.name.toLowerCase().indexOf(searchText) != -1).slice(0, limit));
            }, 500);
        });
    }
}