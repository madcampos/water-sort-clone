import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/GameScreen.ts';

@customElement('help-screen')
export class HelpScreen extends GameScreen {
	// TODO: add interactive bits

	override render() {
		return html`
			<dialog>
				<header>
					<h2>Game Help</h2>
					<button type="button" @click="${() => this.close()}">
						<span class="visually-hidden">Close Help</span>

						<iconify-icon icon="mdi:close"></iconify-icon>
					</button>
				</header>
				<div>
					<details open>
						<summary>How to play the game?</summary>
						<p>
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

						<p><strong>Notes:</strong></p>
						<ul>
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
						<summary>Mouse and Touch</summary>

						<ul>
							<li>
								To select a flask <kbd data-input-icon="click">click</kbd> or <kbd data-input-icon="tap">tap</kbd> it.
							</li>
							<li>
								Then <kbd data-input-icon="click">click</kbd> or <kbd data-input-icon="tap">tap</kbd> another flask to pour the liquid into it.
							</li>
							<li>
								<kbd data-input-icon="click">Clicking</kbd> or <kbd data-input-icon="tap">tapping</kbd> the same flask again deselect it.
							</li>
						</ul>
					</details>
					<details>
						<summary>Keyboard</summary>

						<ul>
							<li>
								To select a flask press <kbd data-keyboard-icon="space">space</kbd> or <kbd data-keyboard-icon="enter">enter</kbd>.
							</li>
							<li>
								To deselect a flask press <kbd data-keyboard-icon="space">space</kbd> or <kbd data-keyboard-icon="enter">enter</kbd> on a <em>selected flask</em>.
							</li>
							<li>
								Move to the <em>next</em> flask by pessing <kbd data-keyboard-icon="right-arrow">Right Arrow</kbd> or <kbd data-keyboard-icon="down-arrow"
								>Down Arrow</kbd>.
							</li>
							<li>
								Move to the <em>previous</em> flask by pessing <kbd data-keyboard-icon="left-arrow">Left Arrow</kbd> or <kbd data-keyboard-icon="up-arrow"
								>Up Arrow</kbd>.
							</li>
							<li>
								Press <kbd data-keyboard-icon="esc">Esc</kbd> to deselect <em>all</em> flasks.
							</li>
						</ul>
					</details>
					<details>
						<summary>Controller</summary>

						<h3>Game Controls</h3>

						<ul>
							<li>
								To select a flask press <controller-badge icon="a"></controller-badge>.
							</li>
							<li>
								To deselect a flask press <controller-badge icon="a"></controller-badge> on a <em>selected flask</em>.
							</li>
							<li>
								Move to the <em>next</em> flask by pessing <controller-badge icon="dpad-right"></controller-badge>, or by moving the <controller-badge icon="right-thumb"></controller-badge> right.
							</li>
							<li>
								Move to the <em>previous</em> flask by pessing <controller-badge icon="dpad-left"></controller-badge>, or by moving the <controller-badge icon="left-thumb"></controller-badge> left.
							</li>
							<li>
								Press <controller-badge icon="b"></controller-badge> to deselect <em>all</em> flasks.
							</li>
							<li>
								Press <controller-badge icon="select"></controller-badge> to <em>reset the level</em>.
							</li>
							<li>
								Press <controller-badge icon="start"></controller-badge> to <em>go open the settings menu</em>.
							</li>
							<li>
								Press <controller-badge icon="y"></controller-badge> to <em>open this help</em>.
							</li>
						</ul>
					</details>
				</div>
			</dialog>
		`;
	}
}
