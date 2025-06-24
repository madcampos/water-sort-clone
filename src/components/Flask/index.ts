import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LiquidColor } from '../../data/levels.js';

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

	@property({ attribute: false, type: Array })
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
		return this.length < this.flaskSize;
	}

	get colors() {
		return [...this.flaskData];
	}

	get topColor() {
		return this.flaskData.at(-1);
	}

	canPour(destination: LiquidFlask) {
		const hasAvailableSpace = destination.hasSpace;
		const isEmptyFlask = destination.length === 0;
		const isSameColorOnTop = this.topColor === destination.topColor;

		return hasAvailableSpace && (isEmptyFlask || isSameColorOnTop);
	}

	pour(source: LiquidFlask) {
		while (source.canPour(this)) {
			const color = source.flaskData.pop();

			if (color) {
				this.flaskData.push(color);
			}
		}
	}

	handleFlaskSelect() {
		if (this.selected) {
			// The same flask is selected, deselect it
			this.selected = false;
		} else {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const mainScreen = document.querySelector('main-screen')!;
			// eslint-disable-next-line @typescript-eslint/prefer-destructuring
			const selectedFlask = mainScreen.selectedFlask;

			if (!selectedFlask) {
				// No flask selected, select it
				this.selected = true;
			} else if (selectedFlask.canPour(this)) {
				// A different flask is selected, atempt to pour...
				this.pour(selectedFlask);
				mainScreen.flaskStatus?.updateStatus('pour', this.index, selectedFlask.index);

				document.dispatchEvent(new CustomEvent('flask-pourend'));
			} else {
				// Failed to pour
				mainScreen.flaskStatus?.updateStatus('failedToPour', this.index, selectedFlask.index);

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
					Flask ${this.index + 1}. ${this.length} colors of ${this.flaskSize}.
				</span>
				<ol role="list">
					${flasklist}
				</ol>
			</button>
		`;
	}
}
