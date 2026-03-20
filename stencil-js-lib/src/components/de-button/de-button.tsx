import { Component, Prop, h } from '@stencil/core';


@Component({
  tag: 'de-button',
  styleUrl: 'de-button.css',
  shadow: false,
})
export class DeButton {
  @Prop() size: 'sm' | 'md' | 'lg' = 'md';

  render() {
    return (<button class={`de-button de-button--${this.size}`}>
      <slot></slot>
    </button>
    );
  }
}
