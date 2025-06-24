import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LiquidColor } from '../../data/levels.js';
import { getGameState } from '../../js/levels.ts';

declare global {
	interface DocumentEventMap {
		'flask-pourend': CustomEvent;
	}
}

@customElement('liquid-flask')
export class LiquidFlask extends LitElement {
	@property({ reflect: true, type: Number })
	accessor index = -1;

	@property({ reflect: true, type: Number })
	accessor flaskSize = -1;

	@property({ reflect: true, type: Boolean })
	accessor selected = false;

	@property({ attribute: false })
	accessor flaskData: LiquidColor[] = [];

	constructor(flaskData?: LiquidColor[]) {
		super();

		this.flaskData = flaskData ?? [];

		document.addEventListener('flask-pourend', () => {
			this.selected = false;
		});
	}

	get length() {
		return this.flaskData.length;
	}

	get hasSpace() {
		return this.length < getGameState().flaskSize;
	}

	get colors() {
		return [...this.flaskData];
	}

	get topColor() {
		return this.flaskData.at(-1);
	}

	pourColor(color?: LiquidColor) {
		if (color) {
			this.flaskData.push(color);
		}
	}

	#canPour(destination: LiquidFlask) {
		const hasAvailableSpace = destination.hasSpace;
		const isEmptyFlask = destination.length === 0;
		const isSameColorOnTop = this.topColor === destination.topColor;

		return hasAvailableSpace && (isEmptyFlask || isSameColorOnTop);
	}

	#pour(destination: LiquidFlask) {
		while (this.#canPour(destination)) {
			destination.pourColor(this.flaskData.pop());
		}
	}

	handleFlaskSelect() {
		if (this.selected) {
			// The same flask is selected, deselect it
			this.selected = false;
		} else {
			const selectedFlask = document.querySelector('liquid-flask[selected="true"]');

			if (!selectedFlask) {
				// No flask selected, select it
				this.selected = true;
			} else if (this.#canPour(selectedFlask)) {
				// A different flask is selected, atempt to pour...
				this.#pour(selectedFlask);
				document.querySelector('flask-status')?.updateStatus('pour', this.index, selectedFlask.index);

				document.dispatchEvent(new CustomEvent('flask-pourend'));
			} else {
				// Failed to pour
				document.querySelector('flask-status')?.updateStatus('failedToPour');

				document.dispatchEvent(new CustomEvent('flask-pourend'));
			}
		}
	}

	override render() {
		const flasklist = this.flaskData
			?.reverse()
			?.map((color, index) =>
				html`
					<li
						class="segment"
						data-color=${color}
						data-index=${index}
					>
						${color ?? ''}
					</li>
				`
			);

		return html`
			<button type="button" ?aria-pressed="${this.selected}" @click="${this.handleFlaskSelect}">
				<span class="visually-hidden">
					Flask ${this.index + 1}. ${this.length} colors of ${getGameState().flaskSize}.
				</span>
				<ol role="list">
					${flasklist}
				</ol>
			</button>
		`;
	}
}
