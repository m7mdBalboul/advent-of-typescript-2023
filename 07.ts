type AppendGood <T>= {
	[Key in keyof T as `good_${Key & string}`]: T[Key]
};