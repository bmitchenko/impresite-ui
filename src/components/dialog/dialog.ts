import { EventEmitter } from '@angular/core';

export interface IDialog {
    close: EventEmitter<any>;
    onInit?(params: any): void;
}