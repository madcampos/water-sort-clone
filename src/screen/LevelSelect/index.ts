import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';
import { availableLevels, getMaxLevel } from '../../js/levels.ts';

@customElement('level-select-screen')
export class LevelSelect extends GameScreen {
	override render() {
		const currentMaxLevel = getMaxLevel();
		const levels = availableLevels.map(({ name }, index) =>
			html`
				<li>
					<button
						type="button"
						data-level-select=${index}
						aria-disabled=${currentMaxLevel <= index ? 'true' : 'false'}
					>Level ${index}: ${name}</button>
				</li>
			`
		);

		return html`
			<dialog aria-labelledby="level-select-label">
				<header>
					<h2 id="level-select-label">Select Level</h2>
				</header>

				<ol>
					${levels}
				</ol>
			</dialog>
		`;
	}
}
