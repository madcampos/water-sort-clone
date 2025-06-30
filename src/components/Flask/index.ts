/* eslint-disable @typescript-eslint/no-magic-numbers */

import { html, LitElement, svg, type TemplateResult, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { LiquidColor } from '../../data/levels.js';

import styles from './styles.css?raw';

declare global {
	interface DocumentEventMap {
		'flask-pourend': CustomEvent;
	}
}

@customElement('liquid-flask')
export class LiquidFlask extends LitElement {
	static override styles = unsafeCSS(styles);

	/* eslint-disable @typescript-eslint/naming-convention */
	static #FLASK_WIDTH = 120;

	static #PADDING_X = 10;
	static #PADDING_Y = 10;

	static #CAP_WIDTH = LiquidFlask.#FLASK_WIDTH - (this.#PADDING_X * 2);
	static #CAP_HEIGHT = LiquidFlask.#FLASK_WIDTH / 3;

	static #SECTION_HEIGHT = LiquidFlask.#CAP_HEIGHT * 2;
	static #SECTION_WIDTH = LiquidFlask.#SECTION_HEIGHT - LiquidFlask.#PADDING_X;

	static #SECTION_X = (LiquidFlask.#FLASK_WIDTH - LiquidFlask.#SECTION_WIDTH) / 2;
	static #SECTION_DIFFERENCE_Y = (LiquidFlask.#CAP_HEIGHT / 2) - LiquidFlask.#PADDING_Y;

	static #MARKINGS_AMOUNT = 3;
	static #MARKINGS_X = 40;
	/* eslint-enable @typescript-eslint/naming-convention */

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

	canBePoured(incomingColor?: LiquidColor) {
		const isEmptyFlask = this.length === 0;
		const isSameColorOnTop = this.topColor === incomingColor;

		return this.hasSpace && (isEmptyFlask || isSameColorOnTop);
	}

	pourFrom(source: LiquidFlask) {
		while (this.canBePoured(source.topColor)) {
			const color = source.flaskData.at(-1);

			if (color) {
				source.flaskData = [...source.flaskData.toSpliced(-1, 1)];
				this.flaskData = [...this.flaskData, color];
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
			} else if (this.canBePoured(selectedFlask.topColor)) {
				// A different flask is selected, atempt to pour...
				this.pourFrom(selectedFlask);
				mainScreen.flaskStatus?.updateStatus('pour', selectedFlask.index, this.index);

				document.dispatchEvent(new CustomEvent('flask-pourend'));
			} else {
				// Failed to pour
				mainScreen.flaskStatus?.updateStatus('failedToPour', selectedFlask.index, this.index);

				document.dispatchEvent(new CustomEvent('flask-pourend'));
			}
		}
	}

	get #svgHeight() {
		const sectionsHeight = this.flaskSize * LiquidFlask.#SECTION_HEIGHT;
		const capAddedHeight = LiquidFlask.#CAP_HEIGHT / 2;
		const totalPadding = LiquidFlask.#PADDING_Y * 2;

		return sectionsHeight + capAddedHeight + totalPadding;
	}

	get #flaskBorder() {
		const startingPoint = `m${LiquidFlask.#SECTION_X + LiquidFlask.#SECTION_WIDTH},${(LiquidFlask.#CAP_HEIGHT / 2) + LiquidFlask.#PADDING_Y}`;
		const sectionLines = `
			m${-LiquidFlask.#SECTION_WIDTH},0
			v${LiquidFlask.#SECTION_HEIGHT}
			m${LiquidFlask.#SECTION_WIDTH},${-LiquidFlask.#SECTION_HEIGHT}
			v${LiquidFlask.#SECTION_HEIGHT}
		`;
		const bottomRound = `
			m${-LiquidFlask.#SECTION_WIDTH},0
			v${LiquidFlask.#SECTION_HEIGHT / 2}
			m${LiquidFlask.#SECTION_WIDTH},${-(LiquidFlask.#SECTION_HEIGHT / 2)}
			v${LiquidFlask.#SECTION_HEIGHT / 2}
			m${-LiquidFlask.#SECTION_WIDTH},0
			a${LiquidFlask.#SECTION_HEIGHT / 2},${LiquidFlask.#SECTION_WIDTH / 2},90,0,0,${LiquidFlask.#SECTION_WIDTH},0
		`;

		return `${startingPoint} ${new Array(this.flaskSize - 1).fill(sectionLines).join(' ')} ${bottomRound}`;
	}

	get #flaskMask() {
		const startingPoint = `m${LiquidFlask.#SECTION_X},${(LiquidFlask.#CAP_HEIGHT / 2) + LiquidFlask.#PADDING_Y}`;
		const lineDown = `v${LiquidFlask.#SECTION_HEIGHT * (this.flaskSize - 0.5)}`;
		const bottomRound = `a${LiquidFlask.#SECTION_HEIGHT / 2},${LiquidFlask.#SECTION_WIDTH / 2},90,0,0,${LiquidFlask.#SECTION_WIDTH},0`;
		const lineUp = `v${-LiquidFlask.#SECTION_HEIGHT * (this.flaskSize - 0.5)}`;

		return `${startingPoint} ${lineDown} ${bottomRound} ${lineUp} z`;
	}

	get #flaskMarkings() {
		const step = LiquidFlask.#SECTION_HEIGHT / (LiquidFlask.#MARKINGS_AMOUNT);
		const lineSize = LiquidFlask.#SECTION_WIDTH / 6;
		const smallLines = new Array(LiquidFlask.#MARKINGS_AMOUNT).fill(`m${-lineSize},${step} h${lineSize}`).join(' ');
		const allLines = new Array(this.flaskSize).fill(`m${-lineSize},0 ${smallLines} h${lineSize}`).join();

		return `m${LiquidFlask.#MARKINGS_X + (lineSize * 2)},${step + 3} ${allLines}`;
	}

	override render() {
		const flasklist: TemplateResult[] = [];
		const flaskGraphics: TemplateResult[] = [];

		for (let index = this.flaskSize - 1; index >= 0; index--) {
			const color = this.flaskData[index];

			if (color) {
				flasklist.push(html`<li>${color}</li>`);
			}

			const sectionY = this.#svgHeight - (LiquidFlask.#SECTION_HEIGHT * (index + 1)) - LiquidFlask.#SECTION_DIFFERENCE_Y;
			const textY = sectionY + LiquidFlask.#SECTION_HEIGHT;

			// TODO: fix index number
			flaskGraphics.push(svg`
				<g class="liquid-color" data-color="${color ?? ''}">
					<rect
						x="${LiquidFlask.#SECTION_X}"
						y="${sectionY}"
						width="${LiquidFlask.#SECTION_WIDTH}"
						height="${LiquidFlask.#SECTION_HEIGHT}"
					/>
					<text
						x="${LiquidFlask.#MARKINGS_X}"
						y="${textY}"
					>
						<tspan class="color-index" dy="-0.5rem">${this.flaskSize - index}</tspan>
						<tspan class="color-name">${color ?? 'No color'}</tspan>
					</text>
				</g>
			`);
		}

		return html`
		<div>
			<button
				type="button"
				id="flask-button"
				aria-pressed="${this.selected ? 'true' : 'false'}"
				aria-describedby="flask-colors"
				@click="${this.handleFlaskSelect}"
			>
				<span class="visually-hidden">
					Flask ${this.index + 1}. ${this.length} of ${this.flaskSize} colors.
				</span>
			</button>

			<ol id="flask-colors" aria-labelledby="flask-button">
				${flasklist}
			</ol>
			<svg width="120" height="${this.#svgHeight}" viewBox="0 0 120 ${this.#svgHeight}" aria-hidden="true">
				<defs>
					<filter id="blur">
						<feBlend mode="lighten" in="BackgroundImage" in2="SourceGraphic" />
						<feGaussianBlur stdDeviation="5" />
					</filter>
				</defs>
				<mask id="flask-mask">
					<path d="${this.#flaskMask}" fill="white" />
				</mask>
				<mask id="liquid-top-mask">
					<path d="M25,71c4.422,3.222 7.633,14.082 12,2c5,-13.833 11,6.698 21,12c7.691,-2.573 8.757,-18 -2,-18c0,-12.878 17.342,-1.592 18,6c0.78,8.992 12.033,6.615 9,-4c-2,-7 7.17,4 12,-8l0,54l-70,0l0,-44Z" fill="white" />
					<circle cx="34" cy="64" r="3" fill="white" />
					<circle cx="41" cy="52" r="1.5" fill="white" />
					<circle cx="35" cy="43" r="1.5" fill="white" />
					<circle cx="76" cy="58" r="3" fill="white" />
					<circle cx="52" cy="44" r="1.5" fill="white" />
					<circle cx="82" cy="42" r="1" fill="white" />
					<circle cx="45" cy="46" r="1.5" fill="white" />
					<circle cx="76" cy="47" r="1" fill="white" />
					<circle cx="67" cy="47" r="2.5" fill="white" />
					<circle cx="50" cy="66" r="2" fill="white" />
				</mask>

				<g id="color-graphics">
					${flaskGraphics}
				</g>

				<path d="${this.#flaskMask}" fill="white" transform="translate(20 20) scale(0.5 0.9)" opacity="0.2" filter="url(#blur)" />

				<path
					id="flask-markings"
					d="${this.#flaskMarkings}"
					stroke="white"
					stroke-width="2"
					mask="url(#flask-mask)"
				/>

				<path
					d="${this.#flaskBorder}"
					stroke="white"
					stroke-linecap="round"
					stroke-width="5"
					fill="none"
				/>

				<rect
					id="flask-cap"
					x="${LiquidFlask.#PADDING_X}"
					y="${LiquidFlask.#PADDING_Y}"
					width="${LiquidFlask.#CAP_WIDTH}"
					height="${LiquidFlask.#CAP_HEIGHT}"
					rx="${LiquidFlask.#CAP_HEIGHT / 2}"
					ry="${LiquidFlask.#CAP_HEIGHT / 2}"
					fill="none"
					stroke="white"
					stroke-width="5"
				/>
			</svg>
		</div>
		`;
	}
}
