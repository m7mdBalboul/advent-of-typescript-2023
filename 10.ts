type StreetSuffixTester<T, Test> = T extends `${infer Suffex} ${infer Rest}`
	? Suffex extends Test
		? true
		: StreetSuffixTester<Rest, Test>
	: T extends `${infer Suffex}`
		? Suffex extends Test
			? true
			: false
		: false;

type X = StreetSuffixTester<"Candy Way Cane Way", "Way">;
