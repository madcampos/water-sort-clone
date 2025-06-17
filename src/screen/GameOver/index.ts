import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';

@customElement('game-over-screen')
export class GameOverScreen extends GameScreen {
	isGameOver() {
		const gameState = getGameState();

		const flasksWithColors = gameState.flasks.filter(({ length }) => length !== 0);
		const colorFlasks = [];

		for (const [index, flask] of flasksWithColors.entries()) {
			const flaskColors = new Set(flask);

			if (flaskColors.size > 1) {
				return false;
			}

			colorFlasks[index] = flaskColors.values().next().value;
		}

		if (new Set(colorFlasks).size !== colorFlasks.length) {
			return false;
		}

		enableNextLevel();
		return true;
	}

	override render() {
		return html`
			<dialog aria-labelledby="game-over-label">
				<header>
					<h2 id="game-over-label" data-translate>Level complete!</h2>
				</header>

				<div>
					<button type="button" data-level-select="next" data-translate>Next Level</button>
					<button type="button" data-level-select="screen" data-translate>Select Level</button>
				</div>
			</dialog>
		`;
	}
}
