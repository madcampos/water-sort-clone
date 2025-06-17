import { LitElement } from 'lit';

declare global {
	interface DocumentEventMap {
		'screen-close': CustomEvent;
	}
}

export class GameScreen extends LitElement {
	constructor() {
		super();

		document.addEventListener('screen-close', () => {
			this.close();
		});
	}

	open() {
		document.dispatchEvent(new CustomEvent('screen-close'));
		this.renderRoot.querySelector('dialog')?.showModal();
	}

	close() {
		this.renderRoot.querySelector('dialog')?.close();
	}
}
