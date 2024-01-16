type RemoveNaughtyChildren <T>= {
	[Key in Exclude<keyof T, `naughty_${string}`>]: T[Key]
};