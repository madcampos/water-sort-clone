import { hideAllScreens } from './index.ts';

function showTitleScreen() {
	hideAllScreens();
	document.querySelector<HTMLDialogElement>('#title-screen')?.showModal();
}

export function hideTitleScreen() {
	document.querySelector<HTMLDialogElement>('#title-screen')?.close();
}
export function initializeTitleScreen() {
	showTitleScreen();
}
