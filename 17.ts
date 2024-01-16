type RockPaperScissors = "👊🏻" | "🖐🏾" | "✌🏽";
type Game = {
	"👊🏻_👊🏻": "draw";
	"👊🏻_🖐🏾": "win";
	"👊🏻_✌🏽": "lose";
	"🖐🏾_🖐🏾": "draw";
	"🖐🏾_✌🏽": "win";
	"🖐🏾_👊🏻": "lose";
	"✌🏽_✌🏽": "draw";
	"✌🏽_👊🏻": "win";
	"✌🏽_🖐🏾": "lose";
};

type WhoWins<
	TPlayerOne extends RockPaperScissors,
	TPlayerTwo extends RockPaperScissors,
> = Game[`${TPlayerOne}_${TPlayerTwo}`];
