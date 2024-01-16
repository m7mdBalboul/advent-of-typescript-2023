type Letters = {
	A: ["█▀█ ", "█▀█ ", "▀ ▀ "];
	B: ["█▀▄ ", "█▀▄ ", "▀▀  "];
	C: ["█▀▀ ", "█ ░░", "▀▀▀ "];
	E: ["█▀▀ ", "█▀▀ ", "▀▀▀ "];
	H: ["█ █ ", "█▀█ ", "▀ ▀ "];
	I: ["█ ", "█ ", "▀ "];
	M: ["█▄░▄█ ", "█ ▀ █ ", "▀ ░░▀ "];
	N: ["█▄░█ ", "█ ▀█ ", "▀ ░▀ "];
	P: ["█▀█ ", "█▀▀ ", "▀ ░░"];
	R: ["█▀█ ", "██▀ ", "▀ ▀ "];
	S: ["█▀▀ ", "▀▀█ ", "▀▀▀ "];
	T: ["▀█▀ ", "░█ ░", "░▀ ░"];
	Y: ["█ █ ", "▀█▀ ", "░▀ ░"];
	W: ["█ ░░█ ", "█▄▀▄█ ", "▀ ░ ▀ "];
	" ": ["░", "░", "░"];
	":": ["#", "░", "#"];
	"*": ["░", "#", "░"];
};

type LetterKeys = keyof Letters;

type FlattenRow<Tarray extends string[], TRes = ""> = Tarray extends [
	infer First extends string,
	...infer Rest extends string[],
]
	? FlattenRow<Rest, `${TRes & string}${First}`>
	: TRes;

type AppendToRow<TRow extends string[], TChar extends string = ""> = TRow extends [...infer Chars]
	? [...Chars, TChar]
	: TRow;

type MakeLine<
	TInput extends string,
	TResult extends string[][] = [[], [], []],
> = TInput extends `${infer First extends LetterKeys}${infer Last}`
	? MakeLine<
			Last,
			[
				AppendToRow<TResult[0], Letters[First][0]>,
				AppendToRow<TResult[1], Letters[First][1]>,
				AppendToRow<TResult[2], Letters[First][2]>,
			]
		>
	: TResult;

type GetFlatLine<TInput extends string[][], TResult extends string[] = []> = TInput extends [
	infer First extends string[],
	...infer Last extends string[][],
]
	? GetFlatLine<Last, [...TResult, FlattenRow<First>]>
	: TResult;

type ToAsciiArt<
	TInput extends string,
	TRes extends string[] = [],
> = TInput extends `${infer FirstLine}\n${infer Rest}`
	? ToAsciiArt<Rest, [...TRes, ...GetFlatLine<MakeLine<Uppercase<FirstLine>>>]>
	: [...TRes, ...GetFlatLine<MakeLine<Uppercase<TInput>>>];
