// @ts-check

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
		document.querySelectorAll(`[name=${element.name}]:not(#${element.id})`).forEach((/** @type {HTMLInputElement} */ radio) => {
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
 * @param {HTMLInputElement} element
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
			element.value = savedElementValue;
	}

	if (savedSetting) {
		document.body.setAttribute(`data-setting-${element.name}`, savedSetting);
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

export function initializeSettings() {
	const settingsElements = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll('#settings-form :is(input)'));

	settingsElements.forEach((element) => {
		loadSettingForElement(element);
	});

	document.querySelector('#settings-form')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('input')) {
			updateSetting(target);
		}
	});

	document.addEventListener('click', (evt) => handleSettingsScreen(evt));
}
