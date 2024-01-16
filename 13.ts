type NatToTuple<N extends number, T extends true[] = []> = T["length"] extends N
	? T
	: NatToTuple<N, [true, ...T]>;

type DayCounter<TFirstDay extends number, TLastDay extends number> = TFirstDay extends TLastDay
	? TFirstDay
	: DayCounter<[...NatToTuple<TFirstDay>, ...NatToTuple<1>]["length"] & number, TLastDay> | TFirstDay;

