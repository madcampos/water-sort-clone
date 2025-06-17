export function updateStatus(status: 'deselected' | 'failedToPour' | 'pour' | 'reset' | 'selected', fromIndex?: number, toIndex?: number) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const statusContainer = document.querySelector<HTMLOutputElement>('#game-status')!;

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
		case 'reset': {
			throw new Error('Not implemented yet: "reset" case');
		}
		default:
			statusContainer.innerHTML = 'Select a flask.';
	}
}
