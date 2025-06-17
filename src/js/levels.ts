import type { Level } from '../data/levels.js';
import { resetFlasks } from './flasks.ts';
import { hideAllScreens, setGameState } from './index.ts';

function getMaxAllowedLevel() {
	return Number.parseInt(localStorage.getItem('maxLevel') ?? '0');
}

function setMaxAllowedLevel(level: number) {
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

	document.querySelectorAll<HTMLButtonElement>('#level-select-screen button').forEach((button) => {
		const buttonLevel = Number.parseInt(button.dataset['levelSelect'] ?? '0');

		button.ariaDisabled = buttonLevel > level ? 'true' : 'false';
	});
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

function showLevelSelectScreen() {
	hideAllScreens();
	document.querySelector<HTMLDialogElement>('#level-select-screen')?.showModal();
}

export function hideLevelSelectScreen() {
	document.querySelector<HTMLDialogElement>('#level-select-screen')?.close();
}

function handleLevelSelect(evt: Event, levels: Level[]) {
	const target = evt.target as HTMLElement;

	if (!target.matches('[data-level-select]')) {
		return;
	}

	if (target.ariaDisabled === 'true') {
		return;
	}

	if (target.dataset['levelSelect'] === 'screen') {
		showLevelSelectScreen();

		return;
	}

	let nextLevel = Number.parseInt(target.dataset['levelSelect'] ?? '0');

	if (target.dataset['levelSelect'] === 'next') {
		nextLevel = getCurrentLevel() + 1;
	}

	if (target.dataset['levelSelect'] === 'current') {
		nextLevel = getCurrentLevel();
	}

	if (target.dataset['levelSelect'] === 'reset') {
		// TODO: translate message
		// eslint-disable-next-line no-alert
		if (!window.confirm('Do you want to reset the current level?')) {
			return;
		}

		nextLevel = getCurrentLevel();
	}

	if (nextLevel >= levels.length) {
		return;
	}

	loadLevel(levels, nextLevel);
	resetFlasks();
	hideAllScreens();
}

export function initializeLevelList(levels: Level[]) {
	const levelList = document.createElement('ol');
	const currentMaxLevel = getMaxPlayerLevel();

	setMaxAllowedLevel(levels.length - 1);

	document.addEventListener('click', (evt) => handleLevelSelect(evt, levels));

	for (const [index, { name }] of levels.entries()) {
		const li = document.createElement('li');
		const button = document.createElement('button');
		button.innerHTML = `Level ${index}: ${name}`;
		button.dataset['levelSelect'] = index.toString();
		button.ariaDisabled = index > currentMaxLevel ? 'true' : 'false';
		li.appendChild(button);
		levelList.appendChild(li);
	}

	document.querySelector('#level-select-screen')?.append(levelList);
}
