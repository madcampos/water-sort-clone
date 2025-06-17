import type { Flask } from '../data/levels.js';
import { handleGameOver } from './game-over.js';
import { getGameState } from './index.js';
import { updateStatus } from './status.js';

function canPour(from: Flask, to: Flask, flaskSize: number) {
	const hasAvailableSpace = to.length < flaskSize;
	const isEmptyFlask = to.length === 0;
	const isSameColorOnTop = from.at(-1) === to.at(-1);

	return hasAvailableSpace && (isEmptyFlask || isSameColorOnTop);
}

function pour(from: Flask, to: Flask, flaskSize: number) {
	while (canPour(from, to, flaskSize)) {
		const color = from.pop();

		if (color) {
			to.push(color);
		}
	}
}

function selectFlask(flaskElement: HTMLElement) {
	flaskElement.setAttribute('aria-pressed', 'true');
	updateStatus('selected', Number.parseInt(flaskElement.dataset['index'] ?? '0'));
}

function deselectFlask(flaskElement: HTMLElement) {
	flaskElement.setAttribute('aria-pressed', 'false');
	updateStatus('deselected', Number.parseInt(flaskElement.dataset['index'] ?? '0'));
}

function deleslectAllFlasks(flasksContainer: HTMLElement) {
	flasksContainer.querySelectorAll('.flask').forEach((flaskElement) => {
		flaskElement.setAttribute('aria-pressed', 'false');
	});
}

function renderFlask(flaskContainer: HTMLElement, index: number) {
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const flask = getGameState().flasks[index]!;

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	let button = flaskContainer.querySelector(`button[data-index="${index}"]`)!;
	const list = button?.querySelector('ol') ?? document.createElement('ol');
	const label = button?.querySelector('span') ?? document.createElement('span');

	// First time setup
	if (!button) {
		button = document.createElement('button');
		button.classList.add('flask');
		button.dataset['index'] = index.toString();

		label.classList.add('visually-hidden');

		// TODO: fix accessibility issues with list to show as a list
		list.role = 'list';

		button.appendChild(label);
		button.appendChild(list);

		deselectFlask(button);
	}

	list.replaceChildren();
	// TODO: translate text
	label.innerHTML = `Flask ${index + 1}. ${getGameState().flasks[index]?.length ?? 0} colors of ${getGameState().flaskSize}.`;

	for (let i = getGameState().flaskSize - 1; i >= 0; i--) {
		const segment = document.createElement('li');

		segment.classList.add('segment');
		segment.dataset['color'] = flask[i] ?? '';
		segment.dataset['index'] = (i + 1).toString();
		segment.dataset['translate'] = '';

		// TODO: translate text
		segment.textContent = flask[i] ?? '';

		list.appendChild(segment);
	}

	return button;
}

function updateFlasks(flasksContainer: HTMLDivElement) {
	for (let i = 0; i < getGameState().flasks.length; i++) {
		renderFlask(flasksContainer, i);
	}
}

function selectFlaskHandler(evt: Event) {
	const flaskElement = evt.target as HTMLElement;

	if (!flaskElement.matches('#flasks button')) {
		return;
	}

	const gameState = getGameState();
	const flasksContainer = flaskElement.parentElement as HTMLDivElement;
	const fromFlaskElement = flasksContainer.querySelector<HTMLElement>('[aria-pressed="true"]');

	if (!fromFlaskElement) {
		// No flask is selected, select one
		selectFlask(flaskElement);
	} else if (fromFlaskElement === flaskElement) {
		// The same flask is selected, deselect it
		deselectFlask(flaskElement);
	} else {
		// A different flask is selected, atempt to pour...
		const fromIndex = Number.parseInt(fromFlaskElement.dataset['index'] ?? '0');
		const toIndex = Number.parseInt(flaskElement.dataset['index'] ?? '0');

		if (canPour(gameState.flasks[fromIndex] as Flask, gameState.flasks[toIndex] as Flask, gameState.flaskSize)) {
			updateStatus('pour', fromIndex, toIndex);
			pour(gameState.flasks[fromIndex] as Flask, gameState.flasks[toIndex] as Flask, gameState.flaskSize);
		} else {
			updateStatus('failedToPour', fromIndex, toIndex);
		}

		deleslectAllFlasks(flasksContainer);
		updateFlasks(flasksContainer);
	}

	handleGameOver();
}

export function resetFlasks() {
	let flasksContainer = document.querySelector<HTMLElement>('#flasks');

	if (!flasksContainer) {
		flasksContainer = document.createElement('main');
		flasksContainer.id = 'flasks';
		flasksContainer.addEventListener('click', (evt) => selectFlaskHandler(evt));

		document.querySelector('#game-screen nav')?.insertAdjacentElement('afterend', flasksContainer);
	}

	flasksContainer.innerHTML = '';

	for (let i = 0; i < getGameState().flasks.length; i++) {
		const flaskElement = renderFlask(flasksContainer, i);

		flasksContainer.appendChild(flaskElement);
	}

	updateStatus('reset');
}

export function initializeFlasksKeyboardInteraction() {
	// TODO: init roving tab index for keyboard navigation
}
