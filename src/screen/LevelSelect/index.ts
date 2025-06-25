import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';
import { availableLevels, getMaxLevel } from '../../js/levels.ts';

@customElement('level-select-screen')
export class LevelSelect extends GameScreen {
	#handleLevelSelect(evt: MouseEvent) {
		const target = evt.target as HTMLButtonElement;

		if (target.matches('button')) {
			if (target.ariaDisabled) {
				return;
			}

			const level = Number.parseInt(target.dataset['level'] ?? '0');

			document.querySelector('main-screen')?.loadLevel(level);
			this.close();
		}
	}

	override render() {
		const currentMaxLevel = getMaxLevel();
		const levels = availableLevels.map(({ name }, index) =>
			html`
				<li>
					<button
						type="button"
						data-level=${index}
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

				<ol @click="${this.#handleLevelSelect}">
					${levels}
				</ol>
			</dialog>
		`;
	}
}
