import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';

@customElement('title-screen')
export class TitleScreen extends GameScreen {
	override render() {
		return html`
			<dialog aria-labelledby="title-label">
				<header>
					<h1 id="title-label" data-translate>Water Sort</h1>
				</header>

				<div>
					<button type="button" data-level-select="current" autofocus>
						<controller-badge icon="a"></controller-badge>
						<span data-translate>Play</span>
					</button>
					<button type="button" data-help>
						<controller-badge icon="a"></controller-badge>
						<span data-translate>How to Play</span>
					</button>
					<button type="button" data-level-select="screen">
						<controller-badge icon="a"></controller-badge>
						<span data-translate>Select Level</span>
					</button>
					<button type="button" data-settings>
						<controller-badge icon="a"></controller-badge>
						<span data-translate>Game Settings</span>
					</button>
				</div>
			</dialog>
		`;
	}
}
