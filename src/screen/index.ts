import type { GameOverScreen } from './GameOver/index.ts';
import type { HelpScreen } from './Help/index.ts';
import type { LevelSelect } from './LevelSelect/index.ts';
import type { MainScreen } from './MainScreen/index.ts';
import type { SettingsScreen } from './Settings/index.ts';
import type { TitleScreen } from './Title/index.ts';

import './GameOver/index.ts';
import './Help/index.ts';
import './LevelSelect/index.ts';
import './MainScreen/index.ts';
import './Settings/index.ts';
import './Title/index.ts';

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
