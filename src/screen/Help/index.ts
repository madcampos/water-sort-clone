import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';

@customElement('help-screen')
export class HelpScreen extends GameScreen {
	// TODO: add interactive bits

	override render() {
		return html`
			<dialog>
				<header>
					<h2 data-translate>Game Help</h2>
					<button type="button" data-help="close">
						<span class="visually-hidden" data-translate>Close Help</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
							/>
						</svg>
					</button>
				</header>
				<div>
					<details open>
						<summary data-translate>How to play the game?</summary>
						<p data-translate>
							<span>In this game you are a chemist, mixing diferent liquids to sort them out by colour.</span>
							<br />
							<span>Your objective is to have a single coloured liquid per flask. It is okay to leave empty flaks.</span>
							<br />
							<span>Once you have separated the coloured liquids, you finish a level.</span>
							<br />
							<span>To move the liquid from one flask to another, first select the flask with the liquid you wish to move, then select the flask to pour the liquid
								in.</span>
							<br />
							<span>Below are instructions for specific input interactions.</span>
						</p>

						<p data-translate><strong>Notes:</strong></p>
						<ul data-translate>
							<li>You may only pour to another flask if the colour of the liquid on top of both match.</li>
							<li>Any colour can be poured in a fully empty flask.</li>
							<li>If there are multiple parts of the same coloured liquid, they are all moved together.</li>
							<li>
								If there are multiple parts of the same coloured liquid, the flask being poured to has to have enough space available for all parts of the coloured
								liquid.
							</li>
						</ul>
					</details>
					<details>
						<summary data-translate>Mouse and Touch</summary>

						<ul>
							<li data-translate>
								To select a flask <kbd data-input-icon="click">click</kbd> or <kbd data-input-icon="tap">tap</kbd> it.
							</li>
							<li data-translate>
								Then <kbd data-input-icon="click">click</kbd> or <kbd data-input-icon="tap">tap</kbd> another flask to pour the liquid into it.
							</li>
							<li data-translate>
								<kbd data-input-icon="click">Clicking</kbd> or <kbd data-input-icon="tap">tapping</kbd> the same flask again deselect it.
							</li>
						</ul>
					</details>
					<details>
						<summary data-translate>Keyboard</summary>

						<ul>
							<li data-translate>
								To select a flask press <kbd data-keyboard-icon="space">space</kbd> or <kbd data-keyboard-icon="enter">enter</kbd>.
							</li>
							<li data-translate>
								To deselect a flask press <kbd data-keyboard-icon="space">space</kbd> or <kbd data-keyboard-icon="enter">enter</kbd> on a <em>selected flask</em>.
							</li>
							<li data-translate>
								Move to the <em>next</em> flask by pessing <kbd data-keyboard-icon="right-arrow">Right Arrow</kbd> or <kbd data-keyboard-icon="down-arrow"
								>Down Arrow</kbd>.
							</li>
							<li data-translate>
								Move to the <em>previous</em> flask by pessing <kbd data-keyboard-icon="left-arrow">Left Arrow</kbd> or <kbd data-keyboard-icon="up-arrow"
								>Up Arrow</kbd>.
							</li>
							<li data-translate>
								Press <kbd data-keyboard-icon="esc">Esc</kbd> to deselect <em>all</em> flasks.
							</li>
						</ul>
					</details>
					<details>
						<summary data-translate>Controller</summary>

						<h3 data-translate>Game Controls</h3>

						<ul>
							<li data-translate>
								To select a flask press <controller-badge icon="a"></controller-badge>.
							</li>
							<li data-translate>
								To deselect a flask press <controller-badge icon="a"></controller-badge> on a <em>selected flask</em>.
							</li>
							<li data-translate>
								Move to the <em>next</em> flask by pessing <controller-badge icon="dpad-right"></controller-badge>, or by moving the <controller-badge icon="right-thumb"></controller-badge> right.
							</li>
							<li data-translate>
								Move to the <em>previous</em> flask by pessing <controller-badge icon="dpad-left"></controller-badge>, or by moving the <controller-badge icon="left-thumb"></controller-badge> left.
							</li>
							<li data-translate>
								Press <controller-badge icon="b"></controller-badge> to deselect <em>all</em> flasks.
							</li>
							<li data-translate>
								Press <controller-badge icon="select"></controller-badge> to <em>reset the level</em>.
							</li>
							<li data-translate>
								Press <controller-badge icon="start"></controller-badge> to <em>go open the settings menu</em>.
							</li>
							<li data-translate>
								Press <controller-badge icon="y"></controller-badge> to <em>open this help</em>.
							</li>
						</ul>
					</details>
				</div>
			</dialog>
		`;
	}
}
