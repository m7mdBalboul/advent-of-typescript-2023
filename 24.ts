type Alley = "  ";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

type AddOneTable = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
type MinusOneTable = [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
type PlusOne<TNum extends number> = `${AddOneTable[TNum]}`;
type MinusOne<TNum extends number> = `${MinusOneTable[TNum]}`;
type ToNumber<TString extends string | number> = TString extends `${infer Number extends number}`
	? Number
	: TString;

type TraverseRow<TRow extends MazeMatrix[number], Goal extends unknown, TRowIndex> = {
	[ColIndex in keyof TRow]: TRow[ColIndex] extends Goal ? [TRowIndex, ColIndex] : never;
};
type FindIndex<TMatrix extends MazeMatrix, Goal extends unknown = "🎅"> = {
	[RowIndex in keyof TMatrix]: TraverseRow<TMatrix[RowIndex], Goal, RowIndex>;
}[number][number];

type DirectionMap<TDirection extends Directions, TCurrentIndex extends [number, number]> = {
	up: [ToNumber<MinusOne<TCurrentIndex[0]>>, ToNumber<TCurrentIndex[1]>];
	down: [ToNumber<PlusOne<TCurrentIndex[0]>>, ToNumber<TCurrentIndex[1]>];
	right: [ToNumber<TCurrentIndex[0]>, ToNumber<PlusOne<TCurrentIndex[1]>>];
	left: [ToNumber<TCurrentIndex[0]>, ToNumber<MinusOne<TCurrentIndex[1]>>];
}[TDirection];

type ReplaceCol<
	TRow extends MazeMatrix[number],
	TColIndex extends number,
	TReplacement extends unknown,
> = {
	[ColIndex in keyof TRow]: ColIndex extends `${TColIndex}` ? TReplacement : TRow[ColIndex];
};

type ReplaceMatrixItem<
	TMatrix extends MazeMatrix,
	TRow extends number,
	TCol extends number,
	TItem extends any,
> = Extract<
	{
		[RowIndex in keyof TMatrix]: RowIndex extends `${TRow}`
			? ReplaceCol<TMatrix[TRow], TCol, TItem>
			: TMatrix[RowIndex];
	},
	MazeMatrix
>;

type MoveSanta<
	TMatrix extends MazeMatrix,
	TCurrentMoveIndex extends [number, number],
	TNextMoveIndex extends [number, number],
> = ReplaceMatrixItem<
	ReplaceMatrixItem<TMatrix, TCurrentMoveIndex[0], TCurrentMoveIndex[1], "  ">,
	TNextMoveIndex[0],
	TNextMoveIndex[1],
	"🎅"
>;

type IsValidMove<
	TMatrix extends MazeMatrix,
	TMoveIndex extends [number, number],
> = TMatrix[number][number] extends DELICIOUS_COOKIES
	? false
	: TMatrix[TMoveIndex[0]][TMoveIndex[1]] extends Alley
		? true
		: false;

// prettier-ignore
type CheckRowForWin<
	TRow extends any[],
	Direction extends Directions,
	CompareList extends [Directions, Directions, Directions],
> = TRow extends [infer _First extends "🎅", ...infer _Last]
	? Direction extends CompareList[0]
		? true
		: false
	: TRow extends [...infer _First, infer _Last extends "🎅"]
		? Direction extends CompareList[1]
			? true
			: false
	: "🎅" extends TRow[number]
		? Direction extends CompareList[2]
				? true
				: false
	: false;

type GetColumn<
	TMatrix extends any[][],
	TColIdx extends number,
	$Res extends any[] = [],
> = TMatrix extends [infer FirstRow extends any[], ...infer Last extends any[][]]
	? GetColumn<Last, TColIdx, [...$Res, FirstRow[TColIdx]]>
	: $Res;

// prettier-ignore
type HasEscaped<TMatrix extends any[][], Dir extends Directions> =
		// First Row Check 
		CheckRowForWin<
				TMatrix[0],
				Dir,
				["left" | "up", "up" | "right", "up"]
			> extends true ? true
		// Last Row Check 
	: CheckRowForWin<
				TMatrix[ToNumber<MinusOne<TMatrix["length"]>>],
				Dir,
				["left" | "down", "down" | "right", "down"]
		  > extends true ? true
		// First Column Check 
	: CheckRowForWin<
				GetColumn<TMatrix, 0>,
				Dir,
				["left" | "up", "left" | "down", "left"]
			> extends true ? true
		// Last Column Check
	: CheckRowForWin<
				GetColumn<TMatrix, ToNumber<MinusOne<TMatrix[0]["length"]>>>,
				Dir,
				["right" | "up", "right" | "down", "right"]
			> extends true ? true
	: TMatrix;

type FillCookies<TMatrix extends any[][], $Res extends any[][] = []> = TMatrix extends [
	infer Row extends any[],
	...infer Rest extends any[][],
]
	? FillCookies<Rest, [...$Res, { [Key in keyof Row]: DELICIOUS_COOKIES }]>
	: $Res;

type Play<
	TMatrix extends MazeMatrix,
	TDirection extends Directions,
	$CurrentIndex extends [number, number] = FindIndex<TMatrix>,
	$NextIndex extends [number, number] = DirectionMap<TDirection, $CurrentIndex>,
> = IsValidMove<TMatrix, $NextIndex> extends true
	? MoveSanta<TMatrix, $CurrentIndex, $NextIndex>
	: HasEscaped<TMatrix, TDirection> extends true
		? FillCookies<TMatrix>
		: TMatrix;

type Move<TMatrix extends MazeMatrix, TDirection extends Directions> = Play<TMatrix, TDirection>;
