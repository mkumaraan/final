// src/app/components/button/button.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="custom-button" [type]="type" [disabled]="disabled">{{ text }}</button>
  `,
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent {
  @Input() text = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
}