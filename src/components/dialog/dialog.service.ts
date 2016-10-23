import { Compiler, Component, ComponentFactory, ComponentRef, Injectable, ViewContainerRef, ComponentFactoryResolver } from "@angular/core";
import '../../rxjs-operators';
import { Subscription } from 'rxjs/Subscription';

import { IDialog } from './dialog';
import { IDialogHost } from './dialog-host';
import { MessageDialog, MessageDialogCommand, MessageDialogIcon } from './message.dialog';

@Injectable()
export class DialogService {
    private _host: IDialogHost;

    public registerHost(host: IDialogHost): void {
        this._host = host;
    }

    public showDialog<TResult>(dialogType: any, params?: any): Promise<TResult> {
        this.ensureHostDefined();

        return this._host.createDialog(dialogType, params);
    }

    public showError(error: Error): Promise<MessageDialogCommand> {
        return this.showMessage(error.toString(), 'Error', [MessageDialogCommand.OK], MessageDialogIcon.Error);
    }

    public showMessage(message: string, header?: string, commands: MessageDialogCommand[] = [MessageDialogCommand.OK], icon = MessageDialogIcon.None): Promise<MessageDialogCommand> {
        return this.showDialog(MessageDialog, {
            message: message,
            header: header,
            commands: commands,
            icon: icon
        });
    }

    public showQuestion(message: string, header?: string): Promise<MessageDialogCommand> {
        return this.showMessage(message, header, [MessageDialogCommand.Yes, MessageDialogCommand.No, MessageDialogCommand.Cancel], MessageDialogIcon.Question);
    }

    public showWarning(message: string, header?: string): Promise<MessageDialogCommand> {
        return this.showMessage(message, header, [MessageDialogCommand.OK], MessageDialogIcon.Warning);
    }

    // public showValidationErrors(errors: IValidationError[]): Promise<MessageDialogCommand> {
    //     var message = errors.map(x => "<p class='message-box-validation-error'>" + x.errorText + "</p>").join("");
    //     return MessageBox.show(message, "Ввод данных", [MessageBoxCommand.OK], MessageBoxIcon.Warning);
    // }    

    public closeDialog(dialog: IDialog, result?: any): void {
        this.ensureHostDefined();

        this._host.closeDialog(dialog, result);
    }

    public destroyDialogs(): void {
        this.ensureHostDefined();

        this._host.destroyDialogs();
    }

    private ensureHostDefined(): void {
        if (this._host == undefined) {
            throw new Error('Dialog host is undefined. <dialog-host> element need to be added to the application component template.');
        }
    }
}