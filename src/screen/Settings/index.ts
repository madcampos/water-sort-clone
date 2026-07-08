import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { GameScreen } from '../../components/GameScreen/GameScreen.ts';
import { type GamepadTypes, GamepadHandler } from '../../js/gamepad.ts';
import settingsStyle from './settings.css?raw';

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
	private settings: SettingsObject = {
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

		// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
		(Object.keys(this.settings) as (keyof SettingsObject)[]).forEach((setting) => {
			const savedSetting = localStorage.getItem(`setting-${setting}`);

			if (savedSetting) {
				// @ts-expect-error
				this.settings[setting] = savedSetting;
			}

			document.body.setAttribute(`data-setting-${setting}`, this.settings[setting]);
			document.body.style.setProperty(`--setting-${setting}`, this.settings[setting]);
		});

		if ('adoptedStyleSheets' in document) {
			const sheet = new CSSStyleSheet();
			sheet.replaceSync(settingsStyle);

			document.adoptedStyleSheets.push(sheet);
		}
	}

	#handleSettingChange(evt: Event) {
		const target = evt.target;

		if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement)) {
			return;
		}

		if (target.matches(':is(input, select)')) {
			let settingValue = target.value;

			if (target.type === 'checkbox') {
				settingValue = target.checked.toString();
			}

			localStorage.setItem(`setting-${target.name}`, settingValue);

			document.body.setAttribute(`data-setting-${target.name}`, settingValue);
			document.body.style.setProperty(`--setting-${target.name}`, settingValue);
		}
	}

	// @ts-expect-error
	// oxlint-disable-next-line no-unused-private-class-members
	#updateSettingsGamepadInstructions(instructions: 'checkbox' | 'general' | 'radio' | 'select') {
		const settingsInstructions = document.querySelector('output#settings-instruction');

		if (!settingsInstructions) {
			return;
		}

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
	// oxlint-disable-next-line no-unused-private-class-members
	#initializeGamepadEvents() {
		window.addEventListener('gamepadbuttonpress', (evt) => {
			const isSettingSelected = Boolean(document.activeElement?.closest('#settings-screen'));

			if (!isSettingSelected) {
				return;
			}

			const { detail: { button } } = evt;
			const settingElements = [...document.querySelectorAll('#settings-screen :is(input, select)')];
			// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
			const currentSetting = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
			const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

			if (!currentSetting) {
				return;
			}

			// oxlint-disable-next-line default-case typescript/switch-exhaustiveness-check
			switch (button) {
				case 'a':
					if (currentSetting.matches('[type="radio"]')) {
						// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
						(currentSetting as HTMLInputElement).checked = true;
						// updateSetting(currentSetting as HTMLInputElement);
					}

					if (currentSetting.matches('[type="checkbox"]')) {
						// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
						(currentSetting as HTMLInputElement).checked = !(currentSetting as HTMLInputElement).checked;
						// updateSetting(currentSetting as HTMLInputElement);
					}
					break;
				case 'b':
					// hideSettingsScreen();
					break;
				case 'left':
					if (currentSetting.matches('select')) {
						const { options, selectedIndex } = currentSetting;
						const newSelectedOption = [...options].at(selectedIndex - 1);

						if (newSelectedOption) {
							newSelectedOption.selected = true;
						}
					}
					break;
				case 'right':
					if (currentSetting.matches('select')) {
						const { options, selectedIndex } = currentSetting;
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
			// oxlint-disable-next-line typescript/consistent-type-assertions typescript/no-unsafe-type-assertion
			const currentSetting = document.activeElement as HTMLInputElement | HTMLSelectElement | null;
			const currentSettingIndex = settingElements.findIndex((element) => element === currentSetting);

			if (!currentSetting) {
				return;
			}

			// oxlint-disable-next-line default-case typescript/switch-exhaustiveness-check
			switch (directionX) {
				case 'left':
					if (currentSetting.matches('select')) {
						const { options, selectedIndex } = currentSetting;
						const newSelectedOption = [...options].at(selectedIndex - 1);

						if (newSelectedOption) {
							newSelectedOption.selected = true;
						}
					}
					break;
				case 'right':
					if (currentSetting.matches('select')) {
						const { options, selectedIndex } = currentSetting;
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
					<h2>Game Settings</h2>
					<button type="button" @click="${() => this.close()}">
						<span class="visually-hidden">Close Settings</span>

						<iconify-icon icon="mdi:close"></iconify-icon>
					</button>
				</header>

				<form id="settings-form" @change=${this.#handleSettingChange}>
					<fieldset>
						<legend>Accessibility Settings</legend>
						<p>
							<label for="show-numbers">
								<input type="checkbox" id="show-numbers" name="showNumbers" .checked=${this.settings.showNumbers === 'true'} autofocus />
								<span>Show numbers for each flask section</span>
							</label>
						</p>
						<p>
							<label for="show-color-names">
								<input type="checkbox" id="show-color-names" name="showColors" .checked=${this.settings.showColors === 'true'} />
								<span>Show colour names on each flask</span>
							</label>
						</p>
						<fieldset>
							<legend>High contrast colours</legend>
							<p>
								<label for="colorblind-mode">
									<input type="radio" id="colorblind-mode" name="colorblindMode" value="none" .checked=${this.settings.colorblindMode === 'none'} />
									<span>Don't change colours</span>
								</label>
							</p>
							<p>
								<label for="colorblind-mode2">
									<input type="radio" id="colorblind-mode2" name="colorblindMode" .checked=${this.settings.colorblindMode === 'pattern'} />
									<span>Show different patterns for each colour</span>
								</label>
							</p>
							<p>
								<label for="colorblind-mode3">
									<input type="radio" id="colorblind-mode3" name="colorblindMode" .checked=${this.settings.colorblindMode === 'shades'} />
									<span>Show different shades of grey for each colour</span>
								</label>
							</p>
						</fieldset>
					</fieldset>

					<fieldset>
						<legend>Audio Settings</legend>
						<p>
							<label for="play-music">
								<input type="checkbox" id="play-music" name="playMusic" .checked=${this.settings.playMusic === 'true'} />
								<span>Play game music</span>
							</label>
						</p>
						<p>
							<label for="play-sound-effects">
								<input type="checkbox" id="play-sound-effects" name="playSoundEffects" .checked=${this.settings.playSoundEffects === 'true'} />
								<span>Play sound effects</span>
							</label>
						</p>
					</fieldset>

					<fieldset>
						<legend>Language Settings</legend>
						<p>
							<label for="game-language">
								<span>Game Language</span>
								<select id="game-language" name="language">
									<option value="en-CA" .selected=${this.settings.language === 'en-CA'}>Canadian English</option>
									<option value="pt-BR" .selected=${this.settings.language === 'en-CA'}>Brazilian Portuguese</option>
								</select>
							</label>
						</p>
					</fieldset>

					<fieldset>
						<legend>Controller Settings</legend>
						<p>
							<label for="game-controller-mapping">
								<span>Controller Mapping</span>
								<select id="game-controller-mapping" name="controllerMapping">
									<option value="xbox" .selected=${this.settings.controllerMapping === 'xbox'}>Xbox</option>
									<option value="dualshock" .selected=${this.settings.controllerMapping === 'dualshock'}>DualShock</option>
									<!-- <option value="joycon-l" .selected=${this.settings.controllerMapping === 'joycon-l'}>Joy-Con - Left only</option> -->
									<!-- <option value="joycon-r" .selected=${this.settings.controllerMapping === 'joycon-r'}>Joy-Con - Right only</option> -->
									<!-- <option value="joycon-lr" .selected=${this.settings.controllerMapping === 'joycon-lr'}>Joy-Con - Left + Right</option> -->
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
