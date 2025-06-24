import { html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { enableNextLevel } from '../../js/levels.ts';

@customElement('main-screen')
export class MainScreen extends LitElement {
	@state()
	accessor #currentLevel = 0;

	constructor() {
		super();

		document.addEventListener('flask-pourend', this.#checkGameOver);
	}

	// TODO: add roving tab index for keyboard navigation

	#openSettings() {
		document.querySelector('settings-screen')?.open();
	}

	loadLevel(level: number | 'current' | 'next') {
		// TODO: implement
	}

	#resetLevel() {
		this.loadLevel(this.#currentLevel);
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
		return html`
			<div>
				<nav>
					<button type="button" @click=${() => this.#resetLevel()}>
						<span class="visually-hidden">Reset Level</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="presentation">
							<path
								fill="currentColor"
								d="M21 11a1 1 0 0 0-1 1a8.05 8.05 0 1 1-2.22-5.5h-2.4a1 1 0 0 0 0 2h4.53a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v1.77A10 10 0 1 0 22 12a1 1 0 0 0-1-1"
							/>
						</svg>
					</button>
					<hr />
					<button type="button" @click=${() => this.#openSettings()}>
						<span class="visually-hidden">Open Settings</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="presentation">
							<path
								fill="currentColor"
								d="m21.32 9.55l-1.89-.63l.89-1.78A1 1 0 0 0 20.13 6L18 3.87a1 1 0 0 0-1.15-.19l-1.78.89l-.63-1.89A1 1 0 0 0 13.5 2h-3a1 1 0 0 0-.95.68l-.63 1.89l-1.78-.89A1 1 0 0 0 6 3.87L3.87 6a1 1 0 0 0-.19 1.15l.89 1.78l-1.89.63a1 1 0 0 0-.68.94v3a1 1 0 0 0 .68.95l1.89.63l-.89 1.78A1 1 0 0 0 3.87 18L6 20.13a1 1 0 0 0 1.15.19l1.78-.89l.63 1.89a1 1 0 0 0 .95.68h3a1 1 0 0 0 .95-.68l.63-1.89l1.78.89a1 1 0 0 0 1.13-.19L20.13 18a1 1 0 0 0 .19-1.15l-.89-1.78l1.89-.63a1 1 0 0 0 .68-.94v-3a1 1 0 0 0-.68-.95M20 12.78l-1.2.4A2 2 0 0 0 17.64 16l.57 1.14l-1.1 1.1l-1.11-.6a2 2 0 0 0-2.79 1.16l-.4 1.2h-1.59l-.4-1.2A2 2 0 0 0 8 17.64l-1.14.57l-1.1-1.1l.6-1.11a2 2 0 0 0-1.16-2.82l-1.2-.4v-1.56l1.2-.4A2 2 0 0 0 6.36 8l-.57-1.11l1.1-1.1L8 6.36a2 2 0 0 0 2.82-1.16l.4-1.2h1.56l.4 1.2A2 2 0 0 0 16 6.36l1.14-.57l1.1 1.1l-.6 1.11a2 2 0 0 0 1.16 2.79l1.2.4ZM12 8a4 4 0 1 0 4 4a4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2a2 2 0 0 1-2 2"
							/>
						</svg>
					</button>
				</nav>
				<main id="flasks">

				</main>
				<footer>
					<output id="game-instructions">
						<!-- TODO: add instructions -->
					</output>
				</footer>
			</div>
		`;
	}
}
