type PlusOne<TElementArr extends any[] = []> = [...TElementArr, any];

type Count<
	TToySack extends string[],
	TToy extends TToySack[number] | string,
	$Count extends any[] = [],
> = TToySack extends [infer First, ...infer Rest extends string[]]
	? First extends TToy
		? Count<Rest, TToy, PlusOne<$Count>>
		: Count<Rest, TToy, $Count>
	: $Count["length"];
