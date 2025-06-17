import { getGameState, hideAllScreens } from './index.js';
import { enableNextLevel } from './levels.js';

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

	enableNextLevel();
	return true;
}

function showGameOverScreen() {
	hideAllScreens();
	document.querySelector<HTMLDialogElement>('#game-over-screen')?.showModal();
}

export function hideGameOverScreen() {
	document.querySelector<HTMLDialogElement>('#game-over-screen')?.close();
}

export function handleGameOver() {
	if (!isGameOver()) {
		return;
	}

	showGameOverScreen();
}
