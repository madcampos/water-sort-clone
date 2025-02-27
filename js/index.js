// @ts-check

import { resetFlasks } from './flasks.js';
import { hideGameOverScreen } from './game-over.js';
import { getCurrentLevel, hideLevelSelectScreen, initializeLevelList, loadLevel } from './levels.js';
import { hideSettingsScreen, initializeSettings } from './settings.js';
import { hideTitleScreen, initializeTitleScreen } from './title.js';

/** @type {import('./globals.js').Level} */
let gameState;

export function getGameState() {
	return gameState;
}

/**
 * @param {import('./globals.js').Level} newState
 */
export function setGameState(newState) {
	gameState = newState;
}

export function hideAllScreens() {
	hideLevelSelectScreen();
	hideGameOverScreen();
	hideTitleScreen();
	hideSettingsScreen();
}

document.addEventListener('DOMContentLoaded', async () => {
	const response = await fetch('./levels.json');
	const levels = /** @type {import('./globals.js').Level[]} */ (await response.json());

	loadLevel(levels, getCurrentLevel());
	initializeSettings();
	initializeTitleScreen();
	initializeLevelList(levels);
	resetFlasks();
});
