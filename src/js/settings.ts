// @ts-check

import { GamepadHandler } from './gamepad.ts';

/**
 * @param {HTMLInputElement} element
 */
function updateSetting(element) {
	let elementValue = element.value;
	let settingValue = element.value;

	if (element.type === 'checkbox') {
		elementValue = element.checked ? 'true' : 'false';
		settingValue = element.checked.toString();
	}

	if (element.type === 'radio') {
		(/** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll(`[name=${element.name}]:not(#${element.id})`))).forEach((radio) => {
			radio.checked = false;
			localStorage.setItem(`#${radio.id}`, 'false');
		});

		elementValue = element.checked ? 'true' : 'false';
	}

	localStorage.setItem(`#${element.id}`, elementValue);

	localStorage.setItem(element.name, settingValue);
	document.body.setAttribute(`data-setting-${element.name}`, settingValue);
}

/**
 * @param {HTMLInputElement | HTMLSelectElement} element
 */
function loadSettingForElement(element) {
	const savedElementValue = localStorage.getItem(`#${element.id}`) ?? '';
	const savedSetting = localStorage.getItem(element.name) ?? '';

	switch (element.type) {
		case 'checkbox':
		case 'radio':
			element.checked = savedElementValue === 'true' || element.checked;
			break;
		default:
			element.value = savedElementValue || element.value;
	}

	if (savedSetting) {
		document.body.setAttribute(`data-setting-${element.name}`, savedSetting);
	}
}

/**
 * @param {'select' | 'radio' | 'checkbox' | 'general'} instructions
 */
function updateSettingsGamepadInstructions(instructions) {
	const settingsInstructions = /** @type {HTMLOutputElement} */ (document.querySelector('#settings-instruction'));

	if (!GamepadHandler.isGamepadConnected) {
		settingsInstructions.innerHTML = '';
		return;
	}

	// TODO: translate
	switch (instructions) {
		case 'select':
			settingsInstructions.innerHTML =
				`Press <kbd data-controller-icon="dpad-left">DPad Left</kbd> and <kbd data-controller-icon="dpad-right">DPad Right</kbd> to change the options. Press <kbd data-controller-icon="dpad-up">DPad Up</kbd> and <kbd data-controller-icon="dpad-down">DPad Down</kbd> to move to other settings.`;
			break;
		case 'checkbox':
			settingsInstructions.innerHTML =
				`Press <kbd data-controller-icon="a">A</kbd> to toggle. Press <kbd data-controller-icon="dpad-up">DPad Up</kbd> and <kbd data-controller-icon="dpad-down">DPad Down</kbd> to move to other settings.`;
			break;
		case 'radio':
			settingsInstructions.innerHTML =
				`Press <kbd data-controller-icon="a">A</kbd> to select. Press <kbd data-controller-icon="dpad-up">DPad Up</kbd> and <kbd data-controller-icon="dpad-down">DPad Down</kbd> to move to other options and settings.`;
			break;
		default:
			settingsInstructions.innerHTML =
				`Press <kbd data-controller-icon="dpad-up">DPad Up</kbd> and <kbd data-controller-icon="dpad-down">DPad Down</kbd> to move between settings.`;
			break;
	}
}

function showSettingsScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#settings-screen')))?.showModal();
}

export function hideSettingsScreen() {
	(/** @type {HTMLDialogElement} */ (document.querySelector('#settings-screen')))?.close();
}

/**
 * @param {Event} evt
 */
function handleSettingsScreen(evt) {
	const target = /** @type {HTMLElement} */ (evt.target);

	if (!target.matches('[data-settings]')) {
		return;
	}

	if (target.dataset.settings === 'close') {
		hideSettingsScreen();
	} else {
		showSettingsScreen();
	}
}

function initializeGamepadEvents() {
	window.addEventListener('gamepadbuttonpress', (evt) => {
		const isSettingSelected = !!document.activeElement?.closest('#settings-screen');

		if (!isSettingSelected) {
			return;
		}

		const { detail: { button } } = /** @type {CustomEvent<import('./gamepad.js').GamepadButtonEventDetail>} */ (evt);
		const settingElements = /** @type {(HTMLInputElement | HTMLSelectElement)[]} */ ([...document.querySelectorAll('#settings-screen :is(input, select)')]);
		const currentSetting = document.activeElement;
		const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

		switch (button) {
			case 'a':
				if (currentSetting.matches('[type="radio"]')) {
					(/** @type {HTMLInputElement} */ (currentSetting)).checked = true;
					updateSetting(/** @type {HTMLInputElement} */ (currentSetting));
				}

				if (currentSetting.matches('[type="checkbox"]')) {
					(/** @type {HTMLInputElement} */ (currentSetting)).checked = !(/** @type {HTMLInputElement} */ (currentSetting)).checked;
					updateSetting(/** @type {HTMLInputElement} */ (currentSetting));
				}
				break;
			case 'b':
				hideSettingsScreen();
				break;
			case 'left':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = /** @type {HTMLSelectElement} */ (currentSetting);

					[...options].at(selectedIndex - 1).selected = true;
				}
				break;
			case 'right':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = /** @type {HTMLSelectElement} */ (currentSetting);

					[...options].at((selectedIndex + 1) % options.length).selected = true;
				}
				break;
			case 'up':
				settingElements.at(currentSettingIndex - 1)?.focus();
				break;
			case 'down':
				settingElements.at((currentSettingIndex + 1) % settingElements.length)?.focus();
				break;
		}
	});

	window.addEventListener('gamepadstickaction', (evt) => {
		const isSettingSelected = !!document.activeElement?.closest('#settings-screen');

		if (!isSettingSelected) {
			return;
		}

		const { detail: { directionX, directionY, stick } } = /** @type {CustomEvent<import('./gamepad.js').GamepadStickEventDetail>} */ (evt);

		if (stick === 'right') {
			return;
		}

		const settingElements = /** @type {(HTMLInputElement | HTMLSelectElement)[]} */ ([...document.querySelectorAll('#settings-screen :is(input, select)')]);
		const currentSetting = document.activeElement;
		const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

		switch (directionX) {
			case 'left':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = /** @type {HTMLSelectElement} */ (currentSetting);

					[...options].at(selectedIndex - 1).selected = true;
				}
				break;
			case 'right':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = /** @type {HTMLSelectElement} */ (currentSetting);

					[...options].at((selectedIndex + 1) % options.length).selected = true;
				}
				break;
		}

		switch (directionY) {
			case 'up':
				settingElements.at(currentSettingIndex - 1)?.focus();
				break;
			case 'down':
				settingElements.at((currentSettingIndex + 1) % settingElements.length)?.focus();
				break;
		}
	});
}

export function initializeSettings() {
	const settingsElements = /** @type {NodeListOf<HTMLInputElement | HTMLSelectElement>} */ (document.querySelectorAll('#settings-form :is(input, select)'));

	settingsElements.forEach((element) => {
		loadSettingForElement(element);
	});

	initializeGamepadEvents();

	document.querySelector('#settings-form')?.addEventListener('focus', (evt) => {
		const target = /** @type {HTMLElement} */ (evt.target);

		if (target instanceof HTMLInputElement) {
			const inputType = /** @type {'checkbox' | 'radio'} */ (target.type);
			updateSettingsGamepadInstructions(inputType);
		} else if (target instanceof HTMLSelectElement) {
			updateSettingsGamepadInstructions('select');
		} else {
			updateSettingsGamepadInstructions('general');
		}
	}, { capture: true });

	document.querySelector('#settings-form')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches(':is(input, select)')) {
			updateSetting(target);
		}
	});

	document.addEventListener('click', (evt) => handleSettingsScreen(evt));
}
