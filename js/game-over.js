import { getGameState, hideAllScreens } from './index.js';

function isGameOver() {
	const gameState = getGameState();

	const flasksWithColors = gameState.flasks.filter(({ length }) => length !== 0);
	const colorFlasks = [];

	for (const [index, flask] of flasksWithColors.entries()) {
		const flaskColors = new Set(flask);

		if (flaskColors.size > 1) {
			return false;
		}

		colorFlasks[index] = flaskColors.values().next().value;
	}

	if (new Set(colorFlasks).size !== colorFlasks.length) {
		return false;
	}

	return true;
}

function showGameOverScreen() {
	hideAllScreens();
	(/** @type {HTMLDialogElement} */ (document.querySelector('#game-over-screen')))?.showModal();
}

export function hideGameOverScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#game-over-screen')))?.close();
}

export function handleGameOver() {
	if (!isGameOver()) {
		return;
	}

	showGameOverScreen();
}
