// @ts-check

import { GamepadHandler } from './gamepad.ts';

function updateSetting(element: HTMLInputElement) {
	let elementValue = element.value;
	let settingValue = element.value;

	if (element.type === 'checkbox') {
		elementValue = element.checked ? 'true' : 'false';
		settingValue = element.checked.toString();
	}

	if (element.type === 'radio') {
		document.querySelectorAll<HTMLInputElement>(`[name=${element.name}]:not(#${element.id})`).forEach((radio) => {
			radio.checked = false;
			localStorage.setItem(`#${radio.id}`, 'false');
		});

		elementValue = element.checked ? 'true' : 'false';
	}

	localStorage.setItem(`#${element.id}`, elementValue);

	localStorage.setItem(element.name, settingValue);
	document.body.setAttribute(`data-setting-${element.name}`, settingValue);
}

function loadSettingForElement(element: HTMLInputElement | HTMLSelectElement) {
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

function updateSettingsGamepadInstructions(instructions: 'checkbox' | 'general' | 'radio' | 'select') {
	const settingsInstructions = document.querySelector('#settings-instruction') as HTMLOutputElement;

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
		case 'general':
		default:
			settingsInstructions.innerHTML =
				`Press <kbd data-controller-icon="dpad-up">DPad Up</kbd> and <kbd data-controller-icon="dpad-down">DPad Down</kbd> to move between settings.`;
			break;
	}
}

function showSettingsScreen() {
	document.querySelector<HTMLDialogElement>('#settings-screen')?.showModal();
}

export function hideSettingsScreen() {
	document.querySelector<HTMLDialogElement>('#settings-screen')?.close();
}

function handleSettingsScreen(evt: Event) {
	const target = evt.target as HTMLElement;

	if (!target.matches('[data-settings]')) {
		return;
	}

	if (target.dataset['settings'] === 'close') {
		hideSettingsScreen();
	} else {
		showSettingsScreen();
	}
}

function initializeGamepadEvents() {
	window.addEventListener('gamepadbuttonpress', (evt) => {
		const isSettingSelected = Boolean(document.activeElement?.closest('#settings-screen'));

		if (!isSettingSelected) {
			return;
		}

		const { detail: { button } } = evt;
		const settingElements = [...document.querySelectorAll('#settings-screen :is(input, select)')];
		const currentSetting = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
		const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

		if (!currentSetting) {
			return;
		}

		// eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
		switch (button) {
			case 'a':
				if (currentSetting.matches('[type="radio"]')) {
					(currentSetting as HTMLInputElement).checked = true;
					updateSetting(currentSetting as HTMLInputElement);
				}

				if (currentSetting.matches('[type="checkbox"]')) {
					(currentSetting as HTMLInputElement).checked = !(currentSetting as HTMLInputElement).checked;
					updateSetting(currentSetting as HTMLInputElement);
				}
				break;
			case 'b':
				hideSettingsScreen();
				break;
			case 'left':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = currentSetting as HTMLSelectElement;
					const newSelectedOption = [...options].at(selectedIndex - 1);

					if (newSelectedOption) {
						newSelectedOption.selected = true;
					}
				}
				break;
			case 'right':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = currentSetting as HTMLSelectElement;
					const newSelectedOption = [...options].at((selectedIndex + 1) % options.length);

					if (newSelectedOption) {
						newSelectedOption.selected = true;
					}
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
		const isSettingSelected = Boolean(document.activeElement?.closest('#settings-screen'));

		if (!isSettingSelected) {
			return;
		}

		const { detail: { directionX, directionY, stick } } = evt;

		if (stick === 'right') {
			return;
		}

		const settingElements = [...document.querySelectorAll('#settings-screen :is(input, select)')];
		const currentSetting = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
		const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

		if (!currentSetting) {
			return;
		}

		// eslint-disable-next-line default-case, @typescript-eslint/switch-exhaustiveness-check
		switch (directionX) {
			case 'left':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = currentSetting as HTMLSelectElement;
					const newSelectedOption = [...options].at(selectedIndex - 1);

					if (newSelectedOption) {
						newSelectedOption.selected = true;
					}
				}
				break;
			case 'right':
				if (currentSetting.matches('select')) {
					const { options, selectedIndex } = currentSetting as HTMLSelectElement;
					const newSelectedOption = [...options].at((selectedIndex + 1) % options.length);

					if (newSelectedOption) {
						newSelectedOption.selected = true;
					}
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
			case undefined:
			default:
		}
	});
}

export function initializeSettings() {
	const settingsElements = document.querySelectorAll('#settings-form :is(input, select)');

	settingsElements.forEach((element) => {
		loadSettingForElement(element);
	});

	initializeGamepadEvents();

	document.querySelector('#settings-form')?.addEventListener('focus', (evt) => {
		const target = evt.target as HTMLElement;

		if (target instanceof HTMLInputElement) {
			const inputType = target.type as 'checkbox' | 'radio';
			updateSettingsGamepadInstructions(inputType);
		} else if (target instanceof HTMLSelectElement) {
			updateSettingsGamepadInstructions('select');
		} else {
			updateSettingsGamepadInstructions('general');
		}
	}, { capture: true });

	document.querySelector('#settings-form')?.addEventListener('change', (evt) => {
		const target = evt.target as HTMLInputElement;

		if (target.matches(':is(input, select)')) {
			updateSetting(target);
		}
	});

	document.addEventListener('click', (evt) => handleSettingsScreen(evt));
}
