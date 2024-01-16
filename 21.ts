type TicTacToeChip = "❌" | "⭕";
type TicTacToeEndState = "❌ Won" | "⭕ Won" | "Draw";
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = "  ";
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = "top" | "middle" | "bottom";
type TicTacToeXPositions = "left" | "center" | "right";
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTactToeBoard = TicTacToeCell[][];
type TicTacToeGame = {
	board: TicTactToeBoard;
	state: TicTacToeState;
};

type EmptyBoard = [["  ", "  ", "  "], ["  ", "  ", "  "], ["  ", "  ", "  "]];

type NewGame = {
	board: EmptyBoard;
	state: "❌";
};

type PositionIndex = {
	"top-left": [0, 0];
	"top-center": [0, 1];
	"top-right": [0, 2];
	"middle-left": [1, 0];
	"middle-center": [1, 1];
	"middle-right": [1, 2];
	"bottom-left": [2, 0];
	"bottom-center": [2, 1];
	"bottom-right": [2, 2];
};

type ToInteger<TNum extends string> = TNum extends `${infer Digit extends number}` ? Digit : never;

type ReplaceCol<
	TRow extends TicTacToeCell[],
	TCol extends number,
	TReplacement extends TicTacToeState,
> = {
	[TColIndex in keyof TRow]: TColIndex extends `${TCol}` ? TReplacement : TRow[TColIndex];
};

type Play<
	TGame extends TicTacToeGame,
	TMove extends TicTacToePositions,
	$Row extends number = PositionIndex[TMove][0],
	$Col extends number = PositionIndex[TMove][1],
	$TBoard extends TicTacToeCell[][] = TGame["board"],
> = Extract<{
	[TRowIndex in keyof $TBoard]: TRowIndex extends `${$Row}`
		? ReplaceCol<$TBoard[TRowIndex], $Col, TGame["state"]>
		: $TBoard[TRowIndex];
}, TicTactToeBoard>

type IsValidMove<
	TGame extends TicTacToeGame,
	TMove extends TicTacToePositions,
	$MoveRow extends number = PositionIndex[TMove][0],
	$MoveCol extends number = PositionIndex[TMove][1],
> = TGame["state"] extends TicTacToeEndState
	? false
	: TGame["board"][$MoveRow][$MoveCol] extends TicTacToeChip
		? false
		: true;

type CheckCells<TCells extends TicTacToeCell[]> = TCells extends [infer FirstCell, ...infer Rest]
	? Rest[number] extends FirstCell
		? FirstCell extends TicTacToeEmptyCell
			? false
			: FirstCell
		: false
	: false;

type HasRowWinner<TBoard extends TicTactToeBoard> = TBoard extends [
	infer Row extends TicTacToeCell[],
	...infer RestOfBoard extends TicTactToeBoard,
]
	? CheckCells<Row> extends infer Chip extends TicTacToeChip
		? `${Chip} Won`
		: HasRowWinner<RestOfBoard>
	: never;

type HasColumnWinner<
	TBoard extends TicTactToeBoard,
	$Idx extends number = 0 | 1 | 2,
> = $Idx extends number
	? CheckCells<[TBoard[0][$Idx], TBoard[1][$Idx], TBoard[2][$Idx]]> extends infer Chip extends
			TicTacToeChip
		? `${Chip} Won`
		: never
	: never;

type CheckDiagonal<TDiagonalRows extends TicTactToeBoard> = TDiagonalRows extends [
	infer Row extends TicTacToeCell[],
	...infer RestOfBoard extends TicTactToeBoard,
]
	? CheckCells<Row> extends infer Chip extends TicTacToeChip
		? `${Chip} Won`
		: CheckDiagonal<RestOfBoard>
	: never;

type DiagonalMap = [
  [[0, 3], [1, 2], [2, 1], [3, 0]],
  [[0, 4], [1, 3], [2, 2], [3, 1], [4, 0]],
  [[0, 5], [1, 4], [2, 3], [3, 2], [4, 1], [5, 0]],
  [[0, 6], [1, 5], [2, 4], [3, 3], [4, 2], [5, 1]],
  [[1, 6], [2, 5], [3, 4], [4, 3], [5, 2]],
  [[2, 6], [3, 5], [4, 4], [5, 3]],
  [[2, 0], [3, 1], [4, 2], [5, 3]],
  [[1, 0], [2, 1], [3, 2], [4, 3], [5, 4]],
  [[0, 0], [1, 1], [2, 2], [3, 3], [4, 4], [5, 5]],
  [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  [[0, 2], [1, 3], [2, 4], [3, 5], [4, 6]],
  [[0, 3], [1, 4], [2, 5], [3, 6]]
];

type HasDiagonalWinner<TBoard extends TicTactToeBoard> = CheckDiagonal<
	[[TBoard[0][0], TBoard[1][1], TBoard[2][2]], [TBoard[0][2], TBoard[1][1], TBoard[2][0]]]
>;

type CheckDraw<TBoard extends TicTacToeGame["board"]> =
	TicTacToeEmptyCell extends TBoard[number][number] ? never : "Draw";

type FindNextState<TList extends any[]> = TList extends [infer First, ...infer Rest]
	? [First] extends [never]
		? FindNextState<Rest>
		: First
	: never;

type GetNextState<
	TGame extends TicTacToeGame,
	$State extends any[] = [
		HasRowWinner<TGame["board"]>,
		HasColumnWinner<TGame["board"]>,
		HasDiagonalWinner<TGame["board"]>,
		CheckDraw<TGame["board"]>,
		TGame["state"] extends "❌" ? "⭕" : "❌",
	],
> = FindNextState<$State>;

type TicTacToe<TGame extends TicTacToeGame, TMove extends TicTacToePositions> = IsValidMove<
	TGame,
	TMove
> extends true
	? {
			board: Play<TGame, TMove>;
			state: GetNextState<{
				board: [...Play<TGame, TMove>];
				state: TGame["state"];
			}>;
		}
	: TGame;
