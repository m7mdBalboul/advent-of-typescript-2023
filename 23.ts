type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';

type EmptyBoard = [
   ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
   ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
   ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
   ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
   ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
   ['  ', '  ', '  ', '  ', '  ', '  ', '  ']
];

type NewGame = {
   board: EmptyBoard;
   state: '🟡';
};

type Connect4EmptyCell = '  ';
type ConnectFourBoard = Connect4Cell[][];
type ConnectFourGame = {
   board: ConnectFourBoard;
   state: Connect4State;
};
type Columns = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type Rows = 0 | 1 | 2 | 3 | 4 | 5;

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

type GetEmptyRow<
   TBoard extends ConnectFourGame['board'],
   TIndex extends Columns
> = TBoard extends [
   ...infer Rest extends TBoard[number][],
   infer Row extends TBoard[number]
]
   ? Row[TIndex] extends '  '
      ? Rest['length']
      : GetEmptyRow<Rest, TIndex>
   : never;

type InsertToCol<
   TRow extends Connect4Cell[],
   TCol extends number,
   TReplacement extends ConnectFourGame['state']
> = {
   [TColIndex in keyof TRow]: TColIndex extends `${TCol}`
      ? TReplacement
      : TRow[TColIndex];
};

type Play<
   TGame extends ConnectFourGame,
   TIndex extends Columns,
   $TBoard extends ConnectFourBoard = TGame['board'],
   $RowIdx extends number = GetEmptyRow<TGame['board'], TIndex>
> = Extract<
   {
      [RowIndex in keyof $TBoard]: RowIndex extends `${$RowIdx}`
         ? InsertToCol<$TBoard[RowIndex], TIndex, TGame['state']>
         : $TBoard[RowIndex];
   },
   ConnectFourBoard
>;

type CheckDraw<TBoard extends ConnectFourGame['board']> =
   '  ' extends TBoard[number][number] ? never : 'Draw';

type CheckWindow<
   TRow extends Connect4Cell[],
   $Window extends Connect4Cell[] = []
> = $Window['length'] extends 4
   ? $Window[number]
   : TRow extends [
        infer First extends Connect4Cell,
        ...infer Rest extends Connect4Cell[]
     ]
   ? $Window['length'] extends 0
      ? CheckWindow<Rest, [First]>
      : First extends Connect4EmptyCell
      ? CheckWindow<Rest, []>
      : $Window[number] extends First
      ? CheckWindow<Rest, [...$Window, First]>
      : CheckWindow<Rest, [First]>
   : false;

type HasColumnWinner<
   TBoard extends ConnectFourBoard,
   $Idx extends number = Columns
> = $Idx extends number
   ? CheckWindow<
        [
           TBoard[0][$Idx],
           TBoard[1][$Idx],
           TBoard[2][$Idx],
           TBoard[3][$Idx],
           TBoard[4][$Idx],
           TBoard[5][$Idx]
        ]
     > extends infer Chip extends Connect4Chips
      ? `${Chip} Won`
      : never
   : never;

type HasRowWinner<TBoard extends ConnectFourBoard> = TBoard extends [
   infer Row extends Connect4Cell[],
   ...infer Rest extends ConnectFourBoard
]
   ? CheckWindow<Row> extends infer Chip extends Connect4Cell
      ? `${Chip} Won`
      : HasRowWinner<Rest>
   : never;

type GetDiagonalRow<
   TBoard extends ConnectFourBoard,
   DiagonalRowMap extends [number, number][],
   TRes extends Connect4Cell[] = []
> = DiagonalRowMap extends [
   infer First extends [number, number],
   ...infer Rest extends [number, number][]
]
   ? GetDiagonalRow<TBoard, Rest, [...TRes, TBoard[First[0]][First[1]]]>
   : TRes;

type HasDiagonalWinner<
   TBoard extends ConnectFourBoard,
   $DiagonalMap extends [number, number][][] = DiagonalMap
> = $DiagonalMap extends [
   infer FirstRow extends [number, number][],
   ...infer Rest extends [number, number][][]
]
   ? CheckWindow<
        GetDiagonalRow<TBoard, FirstRow>
     > extends infer Chip extends Connect4Cell
      ? `${Chip} Won`
      : HasDiagonalWinner<TBoard, Rest>
   : never;

type FindNextState<TList extends any[]> = TList extends [
   infer First,
   ...infer Rest
]
   ? [First] extends [never]
      ? FindNextState<Rest>
      : First
   : never;

type GetNextState<TGame extends ConnectFourGame> = FindNextState<
   [
      HasRowWinner<TGame['board']>,
      HasColumnWinner<TGame['board']>,
      HasDiagonalWinner<TGame['board']>,
      CheckDraw<TGame['board']>,
      TGame['state'] extends '🔴' ? '🟡' : '🔴'
   ]
>;

type Connect4<TGame extends ConnectFourGame, TCol extends Columns> = {
   board: Play<TGame, TCol>;
   state: GetNextState<{ board: Play<TGame, TCol>; state: TGame['state'] }>;
};
