import { hideAllScreens } from './index.ts';

function showTitleScreen() {
	hideAllScreens();
	(/** @type {HTMLDialogElement} */ (document.querySelector('#title-screen')))?.showModal();
}

export function hideTitleScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#title-screen')))?.close();
}
export function initializeTitleScreen() {
	showTitleScreen();
}
