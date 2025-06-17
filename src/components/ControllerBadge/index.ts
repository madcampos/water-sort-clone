import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BUTTON_MAP, type GamepadButtonNames, GamepadHandler } from '../../js/gamepad.ts';

@customElement('controller-badge')
export class ControllerBadge extends LitElement {
	@property()
	accessor icon: GamepadButtonNames | undefined = undefined;

	override render() {
		let iconName = '';

		if (this.icon) {
			iconName = BUTTON_MAP[GamepadHandler.gamepadType][this.icon];
		}

		return html`
			<kbd data-controller-icon="${this.icon ?? ''}" role="none">
				${iconName}
			</kbd>
		`;
	}
}
