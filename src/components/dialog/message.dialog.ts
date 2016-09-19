import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { IDialog } from "./dialog";

import * as template from "./message.dialog.html";
import * as styles from "./message.dialog.scss";

@Component({
    selector: 'message-dialog',
    styles: [styles],
    template: template
})
export class MessageDialog implements IDialog {
    private _buttons: IMessageDialogButton[] = [];
    private _commands: MessageDialogCommand[] = [];
    private _header: string;
    private _icon: MessageDialogIcon;
    private _iconClass: string;
    private _message: string;

    public get commands(): MessageDialogCommand[] {
        return this._commands;
    }

    public set commands(commands: MessageDialogCommand[]) {
        this._commands = commands;

        if (commands == undefined) {
            this._buttons = [];
        } else {
            this._buttons = this._commands.map(x => {
                return {
                    command: x,
                    isPrimary: true,
                    text: this.getCommandText(x)
                };
            });

            // this._buttons[0].isPrimary = true;
        }
    }

    public get header(): string {
        return this._header;
    }

    public set header(header: string) {
        this._header = header;
    }

    public get icon(): MessageDialogIcon {
        return this._icon;
    }

    public set icon(icon: MessageDialogIcon) {
        this._icon = icon;

        if (icon == MessageDialogIcon.None) {
            this._iconClass = undefined;
        } else {
            this._iconClass = this.getIconClass(icon);
        }
    }

    public get message(): string {
        return this._message;
    }

    public set message(message: string) {
        this._message = message;
    }

    public close = new EventEmitter<MessageDialogCommand>();

    private buttonClick(button: IMessageDialogButton): void {
//      if (button.command == MessageDialogCommand.Cancel) {
//          return;
//      }

        this.close.emit(button.command);
    }

    private getIconClass(icon: MessageDialogIcon): string {
        switch (icon) {
            case MessageDialogIcon.Error: return "message-dialog-error-icon";
            case MessageDialogIcon.Info: return "message-dialog-info-icon";
            case MessageDialogIcon.Question: return "message-dialog-question-icon";
            case MessageDialogIcon.Warning: return "message-dialog-warning-icon";
            default: break;
        }
    }

    private getCommandText(command: MessageDialogCommand): string {
        // TODO: Add localization support.
        
        switch (command) {
            case MessageDialogCommand.Abort: return "Прервать";
            case MessageDialogCommand.Cancel: return "Отмена";
            case MessageDialogCommand.Ignore: return "Пропустить";
            case MessageDialogCommand.No: return "Нет";
            case MessageDialogCommand.OK: return "ОК";
            case MessageDialogCommand.Retry: return "Повторить";
            case MessageDialogCommand.Yes: return "Да";
            default: break;
        }
    }
}

export enum MessageDialogIcon {
    Error = 0,
    Info = 1,
    None = 2,
    Question = 3,
    Warning = 4
}

export enum MessageDialogCommand {
    Abort = 0,
    Cancel = 1,
    Ignore = 2,
    No = 3,
    OK = 4,
    Retry = 5,
    Yes = 6
}

interface IMessageDialogButton {
    command: MessageDialogCommand;
    isPrimary?: boolean;
    isWarn?: boolean;
    text: string;
}