import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { getGameState } from '../../js/index.ts';

@customElement('flask-el')
export class Flask extends LitElement {
	@property({ type: Number })
	accessor index = -1;

	select() {
		// TODO: implement
	}

	deselect() {
		// TODO: implement
	}

	canPour(from: Flask, to: Flask, flaskSize: number) {
		const hasAvailableSpace = to.length < flaskSize;
		const isEmptyFlask = to.length === 0;
		const isSameColorOnTop = from.at(-1) === to.at(-1);

		return hasAvailableSpace && (isEmptyFlask || isSameColorOnTop);
	}

	pour(from: Flask, to: Flask, flaskSize: number) {
		while (canPour(from, to, flaskSize)) {
			const color = from.pop();

			if (color) {
				to.push(color);
			}
		}
	}

	override render() {
		const gameState = getGameState();
		const flask = gameState.flasks[this.index];
		const flasklist = [...(flask ?? [])]
			?.reverse()
			?.map((color, index) =>
				html`
					<li
						class="segment"
						data-color=${color}
						data-index=${index}
						data-translate
					>
						${color ?? ''}
					</li>
				`
			);

		return html`
			<button type="button" aria-pressed="false">
				<span class="visually-hidden" data-translate>
					Flask ${this.index + 1}. ${flask?.length ?? 0} colors of ${gameState.flaskSize}.
				</span>
				<ol role="list">
					${flasklist}
				</ol>
			</button>
		`;
	}
}
