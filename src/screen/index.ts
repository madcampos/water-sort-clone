import type { GameOverScreen } from './GameOver/GameOver.ts';
import type { HelpScreen } from './Help/Help.ts';
import type { LevelSelect } from './LevelSelect/LevelSelect.ts';
import type { MainScreen } from './Main/Main.ts';
import type { SettingsScreen } from './Settings/Settings.ts';
import type { TitleScreen } from './Title/Title.ts';

import './GameOver/GameOver.ts';
import './Help/Help.ts';
import './LevelSelect/LevelSelect.ts';
import './Main/Main.ts';
import './Settings/Settings.ts';
import './Title/Title.ts';

declare global {
	interface HTMLElementTagNameMap {
		'game-over-screen': GameOverScreen;
		'help-screen': HelpScreen;
		'level-select-screen': LevelSelect;
		'main-screen': MainScreen;
		'settings-screen': SettingsScreen;
		'title-screen': TitleScreen;
	}
}
