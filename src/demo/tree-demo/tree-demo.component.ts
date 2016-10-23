import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { TreeComponent } from '../../components/tree/tree.component';
import { ITreeNode, TreeNodeComponent } from '../../components/tree/tree-node.component';
import { Data } from '../../test-data';

@Component({
    selector: 'tree-demo',
    styleUrls: ['./tree-demo.component.scss'],
    templateUrl: './tree-demo.component.html'
})
export class TreeDemoComponent implements AfterViewInit {
    @ViewChild(TreeComponent)
    public tree: TreeComponent;

    ngAfterViewInit() {
        this.tree.nodes = this.getCountryNodes();
        // .getJobTitles()
        // .map(x => this.createNode(x, this.getCustomers(x)
        //     .map(c => this.createNode())));
    }

    private getCountryNodes(): ITreeNode[] {
        var countries = Data.Customers
            .map(x => x.country);

        countries = this.distinctSort(countries);

        return countries.map(c => this.createNode(c, this.getCompanyNodes(c)));
    }

    private getCompanyNodes(country: string): ITreeNode[] {
        var customers = Data.Customers
            .filter(x => x.country == country);

        var companies = customers
            .map(x => x.company);

        companies = companies
            .filter(c => Data.Customers.filter(x => x.company == c).length > 5)
            .slice(0, 20);

        var companies = this.distinctSort(companies);

        return companies
            .map(x => this.createNode(x, this.getCustomerNodes(country, x)));
    }

    private getCustomerNodes(country: string, company: string): ITreeNode[] {
        var customers = Data.Customers
            .filter(x => x.company == company);

        var customerNames = customers.map(c => { return `${c.firstName} ${c.lastName}`; });
        customerNames = this.distinctSort(customerNames);

        return customerNames.map(c => this.createNode(c, null));
    }

    private getJobTitles(): string[] {
        var jobTitles: string[] = [];

        Data.Customers
            .map(x => x.jobTitle)
            .forEach((jobTitle) => {
                if (jobTitles.indexOf(jobTitle) == -1) {
                    jobTitles.push(jobTitle);
                }
            });

        return jobTitles;//.slice(0, 10);
    }

    private getCustomers(jobTitle: string): any[] {
        return Data.Customers.filter(x => x.jobTitle == jobTitle).slice(0, 10);
    }

    private createNode(text?: string, nodes?: ITreeNode[]): ITreeNode {
        return {
            nodes: nodes,
            text: text
        };
    }

    private distinctSort(items: string[]): string[] {
        var result: string[] = [];

        items.forEach((item) => {
            if (result.indexOf(item) == -1) {
                result.push(item);
            }
        });

        result.sort((c1, c2) => { return c1.toLowerCase() == c2.toLowerCase() ? 0 : c1.toLowerCase() > c2.toLowerCase() ? 1 : -1; })

        return result;
    }
}