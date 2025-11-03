import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'count-selector',
  templateUrl: './count-selector.component.html',
  styleUrls: ['./count-selector.component.scss']
})
export class CountSelectorComponent {
  @Input() count: number = 1;

  @Output() onCountChang: EventEmitter<number> = new EventEmitter<number>();

  emitCountChange() {
    this.onCountChang.emit(this.count);
  }

  decreaseCount() {
    if (this.count > 1) {
      this.count--;
      this.emitCountChange();
    }
  }

  increaseCount() {
    this.count++;
    this.emitCountChange();
  }
}
