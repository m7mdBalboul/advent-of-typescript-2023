type FindIndex<TArray extends any[]> = TArray extends [...infer Head, infer Last]
	? Last extends "🎅🏼"
		? Head["length"]
		: FindIndex<Head>
	: never;

type FindSanta<TInput extends any[][]> = TInput extends [
	...infer Head extends any[],
	infer Last extends any[],
]
	? FindIndex<Last> extends never
		? FindSanta<Head>
		: [Head["length"], FindIndex<Last>]
	: never;

