import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';
import { getCurrentLevel, getMaxLevel } from '../../js/levels.ts';

@customElement('game-over-screen')
export class GameOverScreen extends GameScreen {
	isGameOver() {
		const flasksWithColors = [...(document.querySelector('main-screen')?.flasks ?? [])].filter((flask) => flask.length);
		const colorFlasks = [];

		for (const [index, flask] of flasksWithColors.entries()) {
			const flaskColors = new Set(flask.flaskData);

			if (flaskColors.size > 1) {
				return false;
			}

			colorFlasks[index] = flaskColors.values().next().value;
		}

		if (new Set(colorFlasks).size !== colorFlasks.length) {
			return false;
		}

		return true;
	}

	#handleNextLevel(evt: MouseEvent) {
		const target = evt.target as HTMLButtonElement;

		if (target.ariaDisabled) {
			return;
		}

		document.querySelector('main-screen')?.loadLevel('next');
		this.close();
	}

	#handleSelectLevel() {
		document.querySelector('level-select-screen')?.open();
	}

	override render() {
		return html`
			<dialog aria-labelledby="game-over-label">
				<header>
					<h2 id="game-over-label">Level complete!</h2>
				</header>

				<div>
					<button type="button" @click="${this.#handleNextLevel}" ?aria-disabled="${getCurrentLevel() === getMaxLevel()}">Next Level</button>
					<button type="button" @click="${this.#handleSelectLevel}">Select Level</button>
				</div>
			</dialog>
		`;
	}
}
