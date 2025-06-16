export type LiquidColor = 'RED' | 'GREEN' | 'YELLOW' | 'BLUE' | 'ORANGE' | 'PURPLE';

export type Flask = LiquidColor[];

export interface Level {
	name: string;
	flasks: Flask[];
	flaskSize: number;
}
