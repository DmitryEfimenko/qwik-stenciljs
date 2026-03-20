import { Component, Prop, h } from '@stencil/core';


@Component({
  tag: 'de-button',
  styleUrl: 'de-button.scss',
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
