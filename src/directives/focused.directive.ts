import { Directive, ElementRef, Input, Output, Renderer, OnDestroy, HostListener, EventEmitter } from '@angular/core';

@Directive({
    selector: '[focused]',
})
export class FocusedDirective implements OnDestroy {
    private _bubble = false;
    private _focused = false;
    private _focusTimer: number;
    private _buffer: number;
    private _element: HTMLElement;

    constructor(private elementRef: ElementRef, private renderer: Renderer) {
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this._element = elementRef.nativeElement as HTMLElement;
        this._focused = document.activeElement == elementRef.nativeElement;

        this.addListeners(this._bubble);
    }

    public get buffer(): number {
        return this._buffer;
    }

    @Input("focus-buffer")
    public set buffer(buffer: number) {
        if (this._buffer == buffer) {
            return;
        }

        this._buffer = buffer;
    }

    public get bubble(): boolean {
        return this._bubble;
    }

    @Input("focus-bubble")
    public set bubble(bubble: boolean) {
        if (this._bubble == bubble) {
            return;
        }

        this._bubble = bubble;
        this.removeListeners();
        this.addListeners(bubble);
    }

    public get focused(): boolean {
        return this._focused;
    }

    @Input()
    public set focused(focused: boolean) {
        if (this._focused == focused) {
            return;
        }

        var element = this.elementRef.nativeElement as HTMLElement;

        if (focused) {
            this.renderer.invokeElementMethod(this.elementRef.nativeElement, "focus");
        }
        else {
            this.renderer.invokeElementMethod(this.elementRef.nativeElement, "blur");
        }
    }

    @Output()
    private focusedChange = new EventEmitter<boolean>();

    @Output('focused-buffered')
    private focusedBufferedChange = new EventEmitter<boolean>();

    private onFocus(): void {
        this.setFocused(true);
    }

    private onBlur(): void {
        this.setFocused(false);
    }

    private setFocused(focused: boolean): void {
        this._focused = focused;
        this.focusedChange.emit(focused);

        if (this._focusTimer != undefined) {
            clearTimeout(this._focusTimer);
            this._focusTimer = undefined;
        }

        this._focusTimer = setTimeout(() => {
            this.focusedBufferedChange.emit(focused);
        }, this._buffer || 0) as any;
    }

    private addListeners(bubble: boolean): void {
        this._element.addEventListener("blur", this.onBlur, bubble);
        this._element.addEventListener("focus", this.onFocus, bubble);
    }

    private removeListeners(): void {
        this._element.removeEventListener("blur", this.onBlur);
        this._element.removeEventListener("focus", this.onFocus);
    }

    public ngOnDestroy(): void {
        this.removeListeners();
    }
}