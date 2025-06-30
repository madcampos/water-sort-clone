import { html, LitElement, unsafeCSS } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import type { LiquidFlask } from '../../components/Flask/index.ts';
import type { FlaskStatus } from '../../components/FlaskStatus/index.ts';
import type { Level } from '../../data/levels.js';
import { enableNextLevel, getCurrentLevel, getGameState, loadLevel, setCurrentLevel } from '../../js/levels.ts';
import styles from './styles.css?raw';

@customElement('main-screen')
export class MainScreen extends LitElement {
	static override styles = unsafeCSS(styles);

	@state()
	accessor #levelState: Level | undefined = undefined;

	@query('flask-status')
	accessor flaskStatus: FlaskStatus | null = null;

	@query('liquid-flask[selected]')
	accessor selectedFlask: LiquidFlask | null = null;

	@queryAll('liquid-flask')
	accessor flasks!: NodeListOf<LiquidFlask>;

	constructor() {
		super();

		document.addEventListener('flask-pourend', this.#checkGameOver);
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

		this.#levelState = getGameState();
	}

	#resetLevel() {
		this.loadLevel('current');
	}

	#checkGameOver() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const gameOverScreen = document.querySelector('game-over-screen')!;
		const isGameOver = gameOverScreen.isGameOver();

		if (isGameOver) {
			gameOverScreen.open();
			enableNextLevel();
		}
	}

	override render() {
		const flasks = this.#levelState?.flasks
			.map((flask, index) =>
				html`
					<liquid-flask
						index="${index}"
						.flaskSize="${this.#levelState?.flaskSize ?? 0}"
						.flaskData="${flask}"
					></liquid-flask>
			`
			);

		return html`
			<div id="game-screen">
				<nav>
					<button type="button" @click=${() => this.#resetLevel()}>
						<span class="visually-hidden">Reset Level</span>
						<svg-icon icon="refresh"></svg-icon>
					</button>
					<hr />
					<button type="button" @click=${() => this.#openSettings()}>
						<span class="visually-hidden">Open Settings</span>
						<svg-icon icon="gear"></svg-icon>
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
			</div>
		`;
	}

	override connectedCallback() {
		super.connectedCallback();
		this.loadLevel('current');
	}
}
