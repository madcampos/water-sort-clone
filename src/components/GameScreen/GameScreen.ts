// oxlint-disable no-use-before-define

import { LitElement } from 'lit';

export class ScreenCloseEvent extends Event {
	screen: GameScreen;

	constructor(gameScreen: GameScreen) {
		super('--screen-close');

		this.screen = gameScreen;
	}
}

export class ScreenOpenEvent extends Event {
	screen: GameScreen;

	constructor(gameScreen: GameScreen) {
		super('--screen-open');

		this.screen = gameScreen;
	}
}

declare global {
	interface DocumentEventMap {
		'--screen-close': ScreenCloseEvent;
		'--screen-open': ScreenOpenEvent;
	}
}

export class GameScreen extends LitElement {
	protected override createRenderRoot() {
		return this;
	}

	open() {
		this.querySelector('dialog')?.showModal();
		document.dispatchEvent(new ScreenOpenEvent(this));
	}

	close() {
		this.querySelector('dialog')?.close();
		document.dispatchEvent(new ScreenCloseEvent(this));
	}

	handleEvent(evt: Event) {
		if (evt instanceof ScreenOpenEvent) {
			if (evt.screen !== this) {
				this.close();
			}
		}
	}

	override connectedCallback() {
		super.connectedCallback();

		document.addEventListener('--screen-close', this);
	}

	override disconnectedCallback() {
		super.disconnectedCallback();

		document.removeEventListener('--screen-close', this);
	}
}
