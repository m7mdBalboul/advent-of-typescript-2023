type Primitives = string | number | Function | boolean;

type SantaListProtector<T> = T extends Primitives
	? T
	: T extends object
		? Readonly<{
				[Key in keyof T]: SantaListProtector<T[Key]>;
			}>
		: never;
