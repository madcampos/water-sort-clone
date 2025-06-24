import type { Level } from '../data/levels.js';

import { default as availableLevels } from '../data/levels.json' with { type: 'json' };
export { default as availableLevels } from '../data/levels.json' with { type: 'json' };

let gameState: Level;

export function getGameState() {
	return gameState;
}

export function setGameState(newState: Level) {
	gameState = newState;
}

export function getMaxLevel() {
	return Number.parseInt(localStorage.getItem('maxLevel') ?? '0');
}

export function setMaxLevel(level: number) {
	localStorage.setItem('maxLevel', level.toString());
}

export function getCurrentLevel() {
	return Number.parseInt(localStorage.getItem('currentLevel') ?? '0');
}

export function enableNextLevel() {
	const nextLevel = getCurrentLevel() + 1;

	if (nextLevel < availableLevels.length) {
		setMaxLevel(nextLevel);
	}
}

export function loadLevel(levels: Level[], index: number) {
	localStorage.setItem('currentLevel', index.toString());

	setGameState(structuredClone(levels[index]) as Level);
}
