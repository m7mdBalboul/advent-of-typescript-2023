type DecipherNaughtyList<T extends string> = T extends `${infer First}/${infer Last}`
	? First | DecipherNaughtyList<Last>
	: T;
