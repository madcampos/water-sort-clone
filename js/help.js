function showHelpScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#help-screen')))?.showModal();
}

export function hideHelpScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#help-screen')))?.close();
}

/**
 * @param {Event} evt
 */
function handleHelpScreen(evt) {
	const target = /** @type {HTMLElement} */ (evt.target);

	if (!target.matches('[data-help]')) {
		return;
	}

	if (target.dataset.help === 'close') {
		hideHelpScreen();
	} else {
		showHelpScreen();
	}
}

export function initializeHelpScreen() {
	document.addEventListener('click', (evt) => handleHelpScreen(evt));

	// TODO: add interactive bits
}
