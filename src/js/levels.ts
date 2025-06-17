import type { Level } from '../data/levels.js';
import { setGameState } from './index.ts';

export { default as availableLevels } from '../data/levels.json' with { type: 'json' };

export function getMaxAllowedLevel() {
	return Number.parseInt(localStorage.getItem('maxLevel') ?? '0');
}

export function setMaxAllowedLevel(level: number) {
	localStorage.setItem('maxLevel', level.toString());
}

export function getCurrentLevel() {
	return Number.parseInt(localStorage.getItem('currentLevel') ?? '0');
}

function getMaxPlayerLevel() {
	return Number.parseInt(localStorage.getItem('maxPlayerLevel') ?? '0');
}

function setNewMaxPlayerLevel(level: number) {
	localStorage.setItem('maxPlayerLevel', level.toString());
}

export function enableNextLevel() {
	const nextLevel = getCurrentLevel() + 1;

	if (nextLevel <= getMaxAllowedLevel()) {
		setNewMaxPlayerLevel(nextLevel);
	}
}

export function loadLevel(levels: Level[], index: number) {
	localStorage.setItem('currentLevel', index.toString());

	const currentMaxLevel = getMaxPlayerLevel();

	if (currentMaxLevel <= index) {
		setNewMaxPlayerLevel(index);
	}

	setGameState(structuredClone(levels[index]) as Level);
}
