import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';

@customElement('title-screen')
export class TitleScreen extends GameScreen {
	#handlePlay() {
		document.querySelector('main-screen')?.loadLevel('current');
		this.close();
	}

	#handleHelp() {
		document.querySelector('help-screen')?.open();
	}

	#handleLevelSelect() {
		document.querySelector('level-select-screen')?.open();
	}

	#handleSettings() {
		document.querySelector('settings-screen')?.open();
	}

	override render() {
		return html`
			<dialog aria-labelledby="title-label">
				<header>
					<h1 id="title-label">Water Sort</h1>
				</header>

				<div>
					<button type="button" @click="${this.#handlePlay}" autofocus>
						<span>Play</span>
					</button>
					<button type="button" @click="${this.#handleHelp}">
						<span>How to Play</span>
					</button>
					<button type="button" @click="${this.#handleLevelSelect}">
						<span>Select Level</span>
					</button>
					<button type="button" @click="${this.#handleSettings}">
						<span>Game Settings</span>
					</button>
				</div>
			</dialog>
		`;
	}
}
