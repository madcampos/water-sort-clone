import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';

type AvailableFlaskStatus = 'deselected' | 'failedToPour' | 'pour' | 'reset' | 'selected';

@customElement('flask-status')
export class FlaskStatus extends LitElement {
	@state()
	accessor #currentStatus = 'Select a flask.';

	updateStatus(status: AvailableFlaskStatus, sourceIndex?: number, destIndex?: number) {
		switch (status) {
			case 'selected':
				this.#currentStatus = `Flask ${(sourceIndex ?? 0) + 1} selected.`;
				break;
			case 'deselected':
				this.#currentStatus = `Flask ${(sourceIndex ?? 0) + 1} deselected.`;
				break;
			case 'pour':
				this.#currentStatus = `Poured from Flask ${(sourceIndex ?? 0) + 1} to Flask ${(destIndex ?? 0) + 1}.`;
				break;
			case 'failedToPour':
				this.#currentStatus = `Cannot pour from Flask ${(sourceIndex ?? 0) + 1} to Flask ${(destIndex ?? 0) + 1}, please select another flask.`;
				break;
			case 'reset':
			default:
				this.#currentStatus = 'Select a flask.';
		}
	}

	override render() {
		return html`<output id="game-status" aria-live="polite">${this.#currentStatus}</output>`;
	}
}
