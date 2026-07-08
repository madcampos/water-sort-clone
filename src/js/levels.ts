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
	return Number.parseInt(localStorage.getItem('maxLevel') ?? '0', 10);
}

export function setMaxLevel(level: number) {
	localStorage.setItem('maxLevel', level.toString());
}

export function getCurrentLevel() {
	return Number.parseInt(localStorage.getItem('currentLevel') ?? '0', 10);
}

export function setCurrentLevel(level: number) {
	if (level < getMaxLevel()) {
		localStorage.setItem('currentLevel', level.toString());
	} else {
		localStorage.setItem('currentLevel', getMaxLevel().toString());
	}
}

export function enableNextLevel() {
	const nextLevel = getCurrentLevel() + 1;

	if (nextLevel < availableLevels.length) {
		setMaxLevel(nextLevel);
	}
}

export function loadLevel(index: number) {
	localStorage.setItem('currentLevel', index.toString());

	// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
	setGameState(structuredClone(availableLevels[index]) as Level);
}
