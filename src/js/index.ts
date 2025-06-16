import { resetFlasks } from './flasks.ts';
import { hideGameOverScreen } from './game-over.ts';
import { GamepadHandler } from './gamepad.ts';
import { hideHelpScreen, initializeHelpScreen } from './help.ts';
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
	hideHelpScreen();
}

document.addEventListener('DOMContentLoaded', async () => {
	const response = await fetch('./levels.json');
	const levels = /** @type {import('./globals.js').Level[]} */ (await response.json());

	GamepadHandler.init(() => {
		// TODO: get mapping and use it as default
		document.body.dataset.gamepad = GamepadHandler.gamepadType;
	});

	loadLevel(levels, getCurrentLevel());
	initializeSettings();
	initializeHelpScreen();
	initializeTitleScreen();
	initializeLevelList(levels);
	resetFlasks();
});
