import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { type GamepadButtonNames, BUTTON_MAP, GamepadHandler } from '../../js/gamepad.ts';

@customElement('controller-badge')
export class ControllerBadge extends LitElement {
	@property()
	accessor icon: GamepadButtonNames | undefined = undefined;

	protected override createRenderRoot() {
		return this;
	}

	override render() {
		let iconName = '';

		if (this.icon) {
			iconName = BUTTON_MAP[GamepadHandler.gamepadType][this.icon];
		}

		return html`
			<kbd data-controller-icon="${this.icon ?? ''}">
				${iconName}
			</kbd>
		`;
	}
}
