type Games = ["🛹", "🚲", "🛴", "🏄"];

type GetGifts<
	TPos extends number,
	TNum extends number,
	$Result extends Games[number][] = [],
> = $Result["length"] extends TNum ? $Result : GetGifts<TPos, TNum, [...$Result, Games[TPos]]>;

type Rebuild<TList extends any[], $Pos extends any[] = []> = TList extends [
	infer Head extends number,
	...infer Rest extends any[],
]
	? Rebuild<
			[...Rest, ...GetGifts<$Pos["length"], Head>],
			$Pos["length"] extends 3 ? [] : [...$Pos, any]
		>
	: TList;
