import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/index.ts';
import { GamepadHandler, type GamepadTypes } from '../../js/gamepad.ts';

interface SettingsObject {
	showNumbers: 'false' | 'true';
	showColors: 'false' | 'true';
	colorblindMode: 'none' | 'pattern' | 'shades';
	playMusic: 'false' | 'true';
	playSoundEffects: 'false' | 'true';
	language: 'en-CA' | 'pt-BR';
	controllerMapping: GamepadTypes;
}

@customElement('settings-screen')
export class SettingsScreen extends GameScreen {
	@state()
	accessor #settings: SettingsObject = {
		showNumbers: 'false',
		showColors: 'false',
		colorblindMode: 'none',
		playMusic: 'true',
		playSoundEffects: 'true',
		language: 'en-CA',
		controllerMapping: 'xbox'
	};

	constructor() {
		super();

		(Object.keys(this.#settings) as (keyof SettingsObject)[]).forEach((setting) => {
			const savedSetting = localStorage.getItem(`setting-${setting}`);

			if (savedSetting) {
				// @ts-expect-error
				this.#settings[setting] = savedSetting;
			}

			document.body.setAttribute(`data-setting-${setting}`, savedSetting ?? this.#settings[setting]);
		});
	}

	#handleSettingChange(evt: Event) {
		const target = evt.target as HTMLInputElement | HTMLSelectElement;

		if (target.matches(':is(input, select)')) {
			let settingValue = target.value;

			if (target.type === 'checkbox') {
				settingValue = target.checked.toString();
			}

			localStorage.setItem(`setting-${target.name}`, settingValue);

			document.body.setAttribute(`data-setting-${target.name}`, settingValue);
		}
	}

	// @ts-expect-error
	// eslint-disable-next-line no-unused-private-class-members
	#updateSettingsGamepadInstructions(instructions: 'checkbox' | 'general' | 'radio' | 'select') {
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

	// @ts-expect-error
	// eslint-disable-next-line no-unused-private-class-members
	#initializeGamepadEvents() {
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
						// updateSetting(currentSetting as HTMLInputElement);
					}

					if (currentSetting.matches('[type="checkbox"]')) {
						(currentSetting as HTMLInputElement).checked = !(currentSetting as HTMLInputElement).checked;
						// updateSetting(currentSetting as HTMLInputElement);
					}
					break;
				case 'b':
					// hideSettingsScreen();
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

	override render() {
		return html`
			<dialog id="settings-screen">
				<header>
					<h2 data-translate>Game Settings</h2>
					<button type="button" data-settings="close">
						<span class="visually-hidden" data-translate>Close Settings</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="m13.41 12l4.3-4.29a1 1 0 1 0-1.42-1.42L12 10.59l-4.29-4.3a1 1 0 0 0-1.42 1.42l4.3 4.29l-4.3 4.29a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l4.29-4.3l4.29 4.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z"
							/>
						</svg>
					</button>
				</header>

				<form id="settings-form" @change=${this.#handleSettingChange}>
					<fieldset>
						<legend data-translate>Accessibility Settings</legend>
						<p>
							<label for="show-numbers">
								<input type="checkbox" id="show-numbers" name="showNumbers" .checked=${this.#settings.showNumbers === 'true'} autofocus />
								<span data-translate>Show numbers for each flask section</span>
							</label>
						</p>
						<p>
							<label for="show-color-names">
								<input type="checkbox" id="show-color-names" name="showColors" .checked=${this.#settings.showColors === 'true'} />
								<span data-translate>Show colour names on each flask</span>
							</label>
						</p>
						<fieldset>
							<legend data-translate>High contrast colours</legend>
							<p>
								<label for="colorblind-mode">
									<input type="radio" id="colorblind-mode" name="colorblindMode" value="none" .checked=${this.#settings.colorblindMode === 'none'} />
									<span data-translate>Don't change colours</span>
								</label>
							</p>
							<p>
								<label for="colorblind-mode2">
									<input type="radio" id="colorblind-mode2" name="colorblindMode" .checked=${this.#settings.colorblindMode === 'pattern'} />
									<span data-translate>Show different patterns for each colour</span>
								</label>
							</p>
							<p>
								<label for="colorblind-mode3">
									<input type="radio" id="colorblind-mode3" name="colorblindMode" .checked=${this.#settings.colorblindMode === 'shades'} />
									<span data-translate>Show different shades of grey for each colour</span>
								</label>
							</p>
						</fieldset>
					</fieldset>

					<fieldset>
						<legend>Audio Settings</legend>
						<p>
							<label for="play-music">
								<input type="checkbox" id="play-music" name="playMusic" .checked=${this.#settings.playMusic === 'true'} />
								<span data-translate>Play game music</span>
							</label>
						</p>
						<p>
							<label for="play-sound-effects">
								<input type="checkbox" id="play-sound-effects" name="playSoundEffects" .checked=${this.#settings.playSoundEffects === 'true'} />
								<span data-translate>Play sound effects</span>
							</label>
						</p>
					</fieldset>

					<fieldset>
						<legend data-translate>Language Settings</legend>
						<p>
							<label for="game-language">
								<span data-translate>Game Language</span>
								<select id="game-language" name="language">
									<option value="en-CA" data-translate .selected=${this.#settings.language === 'en-CA'}>Canadian English</option>
									<option value="pt-BR" data-translate .selected=${this.#settings.language === 'en-CA'}>Brazilian Portuguese</option>
								</select>
							</label>
						</p>
					</fieldset>

					<fieldset>
						<legend data-translate>Controller Settings</legend>
						<p>
							<label for="game-controller-mapping">
								<span data-translate>Controller Mapping</span>
								<select id="game-controller-mapping" name="controllerMapping">
									<option value="xbox" data-translate .selected=${this.#settings.controllerMapping === 'xbox'}>Xbox</option>
									<option value="dualshock" data-translate .selected=${this.#settings.controllerMapping === 'dualshock'}>DualShock</option>
									<!-- <option value="joycon-l" data-translate .selected=${this.#settings.controllerMapping === 'joycon-l'}>Joy-Con - Left only</option> -->
									<!-- <option value="joycon-r" data-translate .selected=${this.#settings.controllerMapping === 'joycon-r'}>Joy-Con - Right only</option> -->
									<!-- <option value="joycon-lr" data-translate .selected=${this.#settings.controllerMapping === 'joycon-lr'}>Joy-Con - Left + Right</option> -->
								</select>
							</label>
						</p>
					</fieldset>
				</form>
				<footer>
					<output id="settings-instruction" aria-live="polite"></output>
				</footer>
			</dialog>
		`;
	}
}
