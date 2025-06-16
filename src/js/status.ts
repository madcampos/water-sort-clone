/**
 * @param {'selected' | 'deselected' | 'pour' | 'failedToPour' | 'reset'} status
 * @param {number} [fromIndex]
 * @param {number} [toIndex]
 */
export function updateStatus(status, fromIndex, toIndex) {
	const statusContainer = /** @type {HTMLOutputElement} */ (document.querySelector('#game-status'));

	// TODO: translate strings

	switch (status) {
		case 'selected':
			statusContainer.innerHTML = `Flask ${(fromIndex ?? 0) + 1} selected.`;
			break;
		case 'deselected':
			statusContainer.innerHTML = `Flask ${(fromIndex ?? 0) + 1} deselected.`;
			break;
		case 'pour':
			statusContainer.innerHTML = `Poured from Flask ${(fromIndex ?? 0) + 1} to Flask ${(toIndex ?? 0) + 1}.`;
			break;
		case 'failedToPour':
			statusContainer.innerHTML = `Cannot pour from Flask ${(fromIndex ?? 0) + 1} to Flask ${(toIndex ?? 0) + 1}, please select another flask.`;
			break;
		default:
			statusContainer.innerHTML = 'Select a flask.';
	}
}
