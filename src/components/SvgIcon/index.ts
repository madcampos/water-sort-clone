import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { unsafeSVG } from 'lit/directives/unsafe-svg.js';
import svgDefs from './defs.svg?raw';

if (!document.querySelector('#icon-defs')) {
	document.body.insertAdjacentHTML('afterbegin', svgDefs);
}

@customElement('svg-icon')
export class SvgIcon extends LitElement {
	@property({ reflect: true, type: String })
	icon = '';

	constructor() {
		super();

		this.ariaHidden = 'true';
		this.role = 'none';
	}

	override render() {
		const iconData = document.querySelector(`#icon-${this.icon}`)?.outerHTML;

		return html`
			<svg width="24" height="24" viewBox="0 0 24 24">
				${unsafeSVG(iconData)}
			</svg>
		`;
	}
}
