import type { Level } from '../data/levels.js';
import { GamepadHandler } from './gamepad.ts';

let gameState: Level;

export function getGameState() {
	return gameState;
}

export function setGameState(newState: Level) {
	gameState = newState;
}

document.addEventListener('DOMContentLoaded', () => {
	GamepadHandler.init();

	// TODO: load first level
});
