export class StackCache {
    public items: any[] = [];

    constructor(public max = 1000) {}

    push(value: any) {
        if (this.items.length >= this.max) {
            this.items = this.items.slice(1, this.max);
        }
        this.items.push(value);
    }
}
