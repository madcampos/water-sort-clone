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
 * @param {string} setting
 * @param {boolean} value
 * @param {HTMLInputElement} checkbox
 */
function updateSetting(setting, value, checkbox) {
	if (value) {
		localStorage.setItem(setting, "true");
		checkbox.checked = true;
		document.body.classList.add(setting);
	} else {
		localStorage.setItem(setting, "false");
		checkbox.checked = false;
		document.body.classList.remove(setting);
	}
}

export function initializeSettings() {
	const settingsForm = /** @type {HTMLFormElement} */ (document.getElementById("settings-form"));

	Array.from(settingsForm.elements).forEach((/** @type {HTMLInputElement} */ checkbox) => {
		const savedValue = localStorage.getItem(checkbox.name);

		updateSetting(checkbox.name, savedValue === "true", checkbox);
	});

	settingsForm.addEventListener('input', (evt) => {
		const target = /** @type {HTMLInputElement} */ (evt.target);

		if (target.matches('input')) {
			updateSetting(target.name, target.checked, target);
		}
	});
}
