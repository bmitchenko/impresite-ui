import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { DialogService } from '../../components/dialog/dialog.service';
import { MessageDialog } from '../../components/dialog/message.dialog';
import { RegistrationComponent } from './registration.component';

import * as template from "./dialog-demo.component.html";
import * as styles from "./dialog-demo.component.scss";

@Component({
    selector: 'dialog-demo',
    template: template,
    styles: [styles]
})
export class DialogDemoComponent {
    constructor(private dialogService: DialogService) {
    }

    private showError(): void {
        this.dialogService.showError(new Error('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu blandit lorem.'));
    }

    private showMessage(): void {
        this.dialogService.showMessage('Pellentesque ac auctor enim. Fusce ultricies vel mi quis tempus. Donec mollis et augue vel faucibus. In et nisi sed elit mollis rutrum vel sed sapien. Aenean semper ipsum rutrum, hendrerit erat sit amet, consequat quam.');
    }

    private showQuestion(): void {
        this.dialogService.showQuestion('Pellentesque ac auctor enim. Fusce ultricies vel mi quis tempus. Donec mollis et augue vel faucibus. In et nisi sed elit mollis rutrum vel sed sapien. Aenean semper ipsum rutrum, hendrerit erat sit amet, consequat quam?', 'Send request?').then((result) => {
            console.log(result);
        });
    }

    private showWarning(): void {
        this.dialogService.showWarning('Pellentesque ac auctor enim. Fusce ultricies vel mi quis tempus. Donec mollis et augue vel faucibus. In et nisi sed elit mollis rutrum vel sed sapien. Aenean semper ipsum rutrum, hendrerit erat sit amet, consequat quam', 'Warning dialog');
    }

    private showRegister(): void {
        this.dialogService.showDialog(RegistrationComponent).then((result) => {
            if (result != undefined) {
                this.dialogService.showMessage(
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut at cursus est. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla laoreet ante dictum, commodo sapien in, luctus dui.',
                    `Welcome, ${result}!`);
            }
        });
    }
}