import type { ControllerBadge } from './components/ControllerBadge/index.ts';
import type { GameOverScreen } from './screen/GameOver/index.ts';
import type { HelpScreen } from './screen/Help/index.ts';
import type { LevelSelect } from './screen/LevelSelect/index.ts';
import type { MainScreen } from './screen/MainScreen/index.ts';
import type { SettingsScreen } from './screens/Settings/index.ts';
import type { TitleScreen } from './screens/Title/index.ts';

declare global {
	interface HTMLElementTagNameMap {
		// Components
		'controller-badge': ControllerBadge;

		// Screens
		'game-over-screen': GameOverScreen;
		'help-screen': HelpScreen;
		'level-select-screen': LevelSelect;
		'main-screen': MainScreen;
		'settings-screen': SettingsScreen;
		'title-screen': TitleScreen;
	}
}
