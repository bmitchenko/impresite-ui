import { Directive, ElementRef, Input, Output, Renderer, OnDestroy, HostListener, EventEmitter } from '@angular/core';

@Directive({
    selector: '[scroll-top]',
})
export class ScrollTopDirective {
    constructor(private element: ElementRef, private renderer: Renderer) {
    }

    private get scrollTop(): number {
        return (this.element.nativeElement as HTMLElement).scrollTop;
    }

    @Input('scroll-top')
    private set scrollTop(scrollTop: number) {
        if (this.scrollTop == scrollTop) {
            return;
        }

        this.renderer.setElementProperty(this.element.nativeElement, 'scrollTop', scrollTop);
        this.scrollTopChange.emit(scrollTop);
    }

    @Output('scroll-top')
    private scrollTopChange = new EventEmitter<number>();

    @HostListener('scroll')
    private onScroll(): void {
        this.scrollTopChange.emit(this.scrollTop);
    }

    public scrollTo(selector: string): void {
        var child = this.renderer.invokeElementMethod(this.element.nativeElement, 'querySelector', [selector]) as any;

        if (child != undefined) {
            this.scrollToElement(child);
        }
    }

    public scrollToElementIndex(index: number): void {
        var element = this.element.nativeElement as HTMLElement;

        if (element.children.length > index) {
            this.scrollToElement(element.children.item(index) as HTMLElement);
        }
    }

    private scrollToElement(element: HTMLElement): void {
        var elementTop = element.offsetTop;

        if (elementTop < this.scrollTop) {
            this.scrollTop = elementTop - 1;
        }
        else {
            var containerHeight = this.element.nativeElement.clientHeight;
            var elementHeight = element.offsetHeight;

            if (this.scrollTop + containerHeight < elementTop + elementHeight) {
                this.scrollTop = elementTop + elementHeight - containerHeight + 1;
            }
        }
    }
}