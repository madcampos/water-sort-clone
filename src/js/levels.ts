import { resetFlasks } from './flasks.ts';
import { hideAllScreens, setGameState } from './index.ts';

function getMaxAllowedLevel() {
	return Number.parseInt(localStorage.getItem('maxLevel') ?? '0');
}

/**
 * @param {number} level
 */
function setMaxAllowedLevel(level) {
	localStorage.setItem('maxLevel', level.toString());
}

export function getCurrentLevel() {
	return Number.parseInt(localStorage.getItem('currentLevel') ?? '0');
}

function getMaxPlayerLevel() {
	return Number.parseInt(localStorage.getItem('maxPlayerLevel') ?? '0');
}

/**
 * @param {number} level
 */
function setNewMaxPlayerLevel(level) {
	localStorage.setItem('maxPlayerLevel', level.toString());

	(/** @type {NodeListOf<HTMLButtonElement>} */ (document.querySelectorAll('#level-select-screen button'))).forEach((button) => {
		const buttonLevel = Number.parseInt(button.dataset.levelSelect ?? '0');

		button.ariaDisabled = buttonLevel > level ? 'true' : 'false';
	});
}

export function enableNextLevel() {
	const nextLevel = getCurrentLevel() + 1;

	if (nextLevel <= getMaxAllowedLevel()) {
		setNewMaxPlayerLevel(nextLevel);
	}
}

/**
 * @param {import('./globals.js').Level[]} levels
 * @param {number} index
 */
export function loadLevel(levels, index) {
	localStorage.setItem('currentLevel', index.toString());

	const currentMaxLevel = getMaxPlayerLevel();

	if (currentMaxLevel <= index) {
		setNewMaxPlayerLevel(index);
	}

	setGameState(structuredClone(levels[index]));
}

function showLevelSelectScreen() {
	hideAllScreens();
	(/** @type {HTMLDialogElement | null} */ (document.querySelector('#level-select-screen')))?.showModal();
}

export function hideLevelSelectScreen() {
	(/** @type {HTMLDialogElement | null} */ (document.querySelector('#level-select-screen')))?.close();
}

/**
 * @param {Event} evt
 * @param {import('./globals.js').Level[]} levels
 */
function handleLevelSelect(evt, levels) {
	const target = /** @type {HTMLElement} */ (evt.target);

	if (!target.matches('[data-level-select]')) {
		return;
	}

	if (target.ariaDisabled === 'true') {
		return;
	}

	if (target.dataset.levelSelect === 'screen') {
		showLevelSelectScreen();

		return;
	}

	let nextLevel = Number.parseInt(target.dataset.levelSelect ?? '0');

	if (target.dataset.levelSelect === 'next') {
		nextLevel = getCurrentLevel() + 1;
	}

	if (target.dataset.levelSelect === 'current') {
		nextLevel = getCurrentLevel();
	}

	if (target.dataset.levelSelect === 'reset') {
		// TODO: translate message
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

/**
 * @param {import('./globals.js').Level[]} levels
 */
export function initializeLevelList(levels) {
	const levelList = document.createElement('ol');
	const currentMaxLevel = getMaxPlayerLevel();

	setMaxAllowedLevel(levels.length - 1);

	document.addEventListener('click', (evt) => handleLevelSelect(evt, levels));

	for (const [index, { name }] of levels.entries()) {
		const li = document.createElement('li');
		const button = document.createElement('button');
		button.innerHTML = `Level ${index}: ${name}`;
		button.dataset.levelSelect = index.toString();
		button.ariaDisabled = index > currentMaxLevel ? 'true' : 'false';
		li.appendChild(button);
		levelList.appendChild(li);
	}

	document.querySelector('#level-select-screen')?.append(levelList);
}
