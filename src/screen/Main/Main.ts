import { html, LitElement } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import type { LiquidFlask } from '../../components/Flask/Flask.ts';
import type { FlaskStatus } from '../../components/FlaskStatus/FlaskStatus.ts';
import type { Level } from '../../data/levels.js';
import { enableNextLevel, getCurrentLevel, getGameState, loadLevel, setCurrentLevel } from '../../js/levels.ts';

@customElement('main-screen')
export class MainScreen extends LitElement {
	@state()
	private accessor levelState: Level | undefined = undefined;

	@query('flask-status')
	accessor flaskStatus: FlaskStatus | null = null;

	@query('liquid-flask[selected]')
	accessor selectedFlask: LiquidFlask | null = null;

	@queryAll('liquid-flask')
	accessor flasks!: NodeListOf<LiquidFlask>;

	protected override createRenderRoot() {
		return this;
	}

	constructor() {
		super();

		document.addEventListener('--flask-pourend', this.#checkGameOver);
	}

	// TODO: add roving tab index for keyboard navigation

	#openSettings() {
		document.querySelector('settings-screen')?.open();
	}

	loadLevel(level: number | 'current' | 'next') {
		if (level === 'next') {
			setCurrentLevel(getCurrentLevel() + 1);
		}

		if (typeof level === 'number') {
			setCurrentLevel(level);
		}

		loadLevel(getCurrentLevel());

		this.levelState = getGameState();
	}

	#resetLevel() {
		this.loadLevel('current');
	}

	#checkGameOver() {
		// oxlint-disable-next-line typescript/no-non-null-assertion
		const gameOverScreen = document.querySelector('game-over-screen')!;
		const isGameOver = gameOverScreen.isGameOver();

		if (isGameOver) {
			gameOverScreen.open();
			enableNextLevel();
		}
	}

	override render() {
		const flasks = this.levelState?.flasks
			.map((flask, index) =>
				html`
					<liquid-flask
						index="${index}"
						.flaskSize="${this.levelState?.flaskSize ?? 0}"
						.flaskData="${flask}"
					></liquid-flask>
			`
			);

		return html`
			<nav>
				<button type="button" @click=${() => this.#resetLevel()}>
					<sr-only>Reset Level</sr-only>
					<iconify-icon mdi:refresh"></iconify-icon>
				</button>
				<hr />
				<button type="button" @click=${() => this.#openSettings()}>
					<sr-only>Open Settings</sr-only>
					<iconify-icon icon="mdi:gear"></iconify-icon>
				</button>
			</nav>
			<main id="flasks">
				${flasks}
			</main>
			<footer>
				<flask-status></flask-status>
				<output id="game-instructions">
					<!-- TODO: add instructions -->
				</output>
			</footer>
		`;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.loadLevel('current');
	}
}
