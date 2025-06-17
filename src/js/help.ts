function showHelpScreen() {
	document.querySelector<HTMLDialogElement>('#help-screen')?.showModal();
}

export function hideHelpScreen() {
	document.querySelector<HTMLDialogElement>('#help-screen')?.close();
}

function handleHelpScreen(evt: Event) {
	const target = evt.target as HTMLElement;

	if (!target.matches('[data-help]')) {
		return;
	}

	if (target.dataset['help'] === 'close') {
		hideHelpScreen();
	} else {
		showHelpScreen();
	}
}

export function initializeHelpScreen() {
	document.addEventListener('click', (evt) => handleHelpScreen(evt));

	// TODO: add interactive bits
}
