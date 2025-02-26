// @ts-check

const statusContainer = document.getElementById('status');

/**
 *
 * @param {'selected' | 'deselected' | 'pour' | 'failedToPour' | 'reset'} status
 * @param {number} [fromIndex]
 * @param {number} [toIndex]
 */
export function updateStatus(status, fromIndex, toIndex) {
  switch (status) {
    case "selected":
      statusContainer.innerHTML = `Flask ${fromIndex + 1} selected.`;
      break;
    case "deselected":
      statusContainer.innerHTML = `Flask ${fromIndex + 1} deselected.`;
      break;
    case "pour":
      statusContainer.innerHTML = `Poured from Flask ${fromIndex + 1} to Flask ${toIndex + 1}.`;
      break;
    case "failedToPour":
      statusContainer.innerHTML = `Cannot pour from Flask ${fromIndex + 1} to Flask ${toIndex + 1}, select another flask.`;
      break;
    default:
      statusContainer.innerHTML = "Select a flask.";
  }
}

/**
 * @param {HTMLInputElement} element
 */
function updateSetting(element) {
	switch (element.type) {
		case 'checkbox':
		case 'radio':
			localStorage.setItem(`#${element.id}`, element.checked ? 'true' : 'false');
			break;
		default:
			localStorage.setItem(`#${element.id}`, element.value ?? '');
	}

	localStorage.setItem(element.name, element.value);
	document.body.setAttribute(`data-setting-${element.name}`, element.value);
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

export function initializeSettings() {
	const settingsElements = /** @type {NodeListOf<HTMLInputElement>} */ (document.querySelectorAll("#settings-form :is(input)"));

	settingsElements.forEach((element) => {
		loadSettingForElement(element);
	});

	document.querySelector('#settings-form')?.addEventListener('change', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('input')) {
			updateSetting(target);
		}
	});
}
