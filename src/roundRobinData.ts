import type { ChapterData, Option, Question, SetData } from './data';

type Structured = NonNullable<Question['structured']>;

const rrMc = (label: string, text: string): Option => ({ label, text });
const RR_SOURCE = 'User-provided Round Robin master set';

const rrQ = (
  setId: string,
  number: number,
  questionText: string,
  answer: string,
  options: Option[] = [],
  answerType: 'mc' | 'tita' = 'tita',
  structured?: Structured,
): Question => ({
  id: `round-robin-q${number}`,
  number,
  setId,
  questionText,
  answer,
  options,
  sourcePage: RR_SOURCE,
  answerType,
  visualRequired: false,
  ...(structured ? { structured } : {}),
});

const rrSet = (
  number: number,
  title: string,
  topic: string,
  questionNumbers: number[],
  commonInformation = '',
  directions = '',
): SetData => ({
  id: `round-robin-set-${number}`,
  number,
  title,
  topic,
  questionRange: [Math.min(...questionNumbers), Math.max(...questionNumbers)],
  directions,
  commonInformation,
  sourcePages: [RR_SOURCE],
  questions: [],
  questionNumbers,
});

const economy210 = `For this section, teams play a round robin: everyone plays everyone once. Under the 2–1–0 system, a win earns 2 points, a draw earns 1 point and a loss earns 0 points.`;
const economy310 = `For this section, teams play a round robin: everyone plays everyone once. Under the 3–1–0 system, a win earns 3 points, a draw earns 1 point and a loss earns 0 points.`;
const qualificationCore = `For Questions 25–31: 8 teams, everyone plays everyone once, Win = 2, Draw = 1, Loss = 0, and the top 4 qualify.`;

const set1 = rrSet(1, 'Basic structure', 'Match counting', [1, 2, 4, 5]);
set1.questions = [
  rrQ(set1.id, 1, 'A round robin tournament is held among 9 teams. How many total matches are played?', '36'),
  rrQ(set1.id, 2, 'In a round robin tournament, a total of 55 matches were played. How many teams participated?', '11 teams'),
  rrQ(set1.id, 4, 'A round robin is played among teams A, B, C, D, E, F. How many matches are played that involve either Team A or Team B, i.e. at least one of them?', '9'),
  rrQ(set1.id, 5, 'In a round robin among 8 teams, how many matches are played among just the bottom 3 teams?', '3'),
];

const set2 = rrSet(2, '2–1–0 point economy', 'Points / draws', [6, 8, 11, 20], economy210);
set2.questions = [
  rrQ(set2.id, 6, 'Eight teams play a round robin under the 2–1–0 system. What is the total number of points distributed across all teams?', '56 points'),
  rrQ(set2.id, 8, 'In an 8-team round robin under 2–1–0, Team X finishes with 10 points from 7 matches. Find all possible W/D/L combinations.', '(5W,0D,2L), (4W,2D,1L), (3W,4D,0L)', [], 'tita', { kind: 'records', labels: ['Wins', 'Draws', 'Losses'], rows: 3 }),
  rrQ(set2.id, 11, 'In a 6-team round robin under 2–1–0, each team played exactly one draw in the entire tournament. How many draw matches occurred, and what is the total number of points distributed?', '3 draws; 30 points', [], 'tita', { kind: 'fields', labels: ['Number of draws', 'Total points'] }),
  rrQ(set2.id, 20, 'In a 6-team round robin under 2–1–0, there are 7 draws. The draw counts of the six teams are 3, 3, 2, 2, 2, 2. Is this feasible?', 'Feasible'),
];

const set3 = rrSet(3, '3–1–0 economy', 'Points / draws', [12, 13, 14, 15, 16], economy310);
set3.questions = [
  rrQ(set3.id, 12, 'In an 8-team round robin under 3–1–0, what is the maximum total number of points that could be distributed?', '84 points'),
  rrQ(set3.id, 13, 'In an 8-team round robin under 3–1–0, the total points distributed were 76. How many matches ended in draws?', '8 draws'),
  rrQ(set3.id, 14, 'In a 6-team round robin under 3–1–0, Team P has 11 points from 5 matches. Find all possible W/D/L combinations.', '3W, 2D, 0L'),
  rrQ(set3.id, 15, 'In an 8-team round robin under 3–1–0, is a total points figure of 83 possible? What about 84? What about 85?', '83: Yes; 84: Yes; 85: No'),
  rrQ(set3.id, 16, 'In an 8-team round robin under 3–1–0, 6 matches ended in draws and the rest were decisive. What is the total points tally?', '78 points'),
];

const set4 = rrSet(4, 'Single-team maximum / minimum', 'Individual points', [21, 22, 23, 24]);
set4.questions = [
  rrQ(set4.id, 21, 'In an 8-team round robin under 2–1–0, what is the maximum points any single team can score?', '14'),
  rrQ(set4.id, 22, 'In a 6-team round robin under 3–1–0, Team Q currently has 9 points with 2 matches remaining. What is its maximum possible final score?', '15'),
  rrQ(set4.id, 23, 'In an 8-team round robin under 2–1–0, Team R has 4 wins and 2 draws in 7 matches. What is its final score?', '10'),
  rrQ(set4.id, 24, 'In an 8-team round robin under 2–1–0, Team S has already played 5 matches, winning 3, drawing 1 and losing 1. What is the minimum number of additional points it can secure from its last 2 matches?', '0 additional points'),
];

const set5 = rrSet(5, 'Qualification optimization', 'Qualification boundaries', [25, 26, 27, 28, 29, 30, 31], qualificationCore);
set5.questions = [
  rrQ(set5.id, 25, 'What is the minimum number of points a team can score and still qualify for the top 4?', '4 points'),
  rrQ(set5.id, 26, 'What is the maximum number of points a team can score and still fail to qualify?', '10 points'),
  rrQ(set5.id, 27, 'What is the minimum number of points that guarantees qualification for the top 4, without relying on a tie-break?', '11 points'),
  rrQ(set5.id, 28, 'Tie-breaks are used when teams are level on points. Can a team qualify with fewer than the answer to Q25? Explain.', 'No'),
  rrQ(set5.id, 29, 'Five teams — A, B, C, D and E — all finish on the same number of points. Only 4 can qualify. Is this possible? Construct a valid tournament configuration.', 'Yes'),
  rrQ(set5.id, 30, 'Now change the scoring system to 3–1–0, keeping 8 teams and top 4 qualifying. What is the minimum number of points that guarantees qualification?', '16 points'),
  rrQ(set5.id, 31, 'There are now 10 teams, with top 4 qualifying, under the 2–1–0 system. What is the minimum number of points that guarantees qualification?', '15 points'),
];

const set6 = rrSet(6, 'Rank-specific optimization', 'Rank boundaries', [35, 36]);
set6.questions = [
  rrQ(set6.id, 35, 'In a 6-team round robin under 2–1–0, what is the maximum number of points a team can have and still finish 2nd or lower?', '9 points'),
  rrQ(set6.id, 36, 'In an 8-team round robin under 2–1–0, what is the minimum number of points that guarantees a top-2 finish?', '13 points'),
];

const set7 = rrSet(7, 'Feasibility', 'Points-table feasibility', [39, 40, 41, 42], economy210);
set7.questions = [
  rrQ(set7.id, 39, 'Which of the following is a valid final points table for a 5-team round robin under 2–1–0?', 'a', [
    rrMc('a', '8,6,4,2,0'),
    rrMc('b', '8,8,8,8,8'),
    rrMc('c', '8,6,6,4,0'),
    rrMc('d', '7,6,5,4,3'),
  ], 'mc'),
  rrQ(set7.id, 40, 'Can all 8 teams finish on exactly the same number of points in an 8-team round robin under 2–1–0? If yes, what is that score?', 'Yes, 7 points each'),
  rrQ(set7.id, 41, 'In a 6-team round robin under 2–1–0, can three teams all finish with 0 points?', 'No'),
  rrQ(set7.id, 42, 'In an 8-team round robin under 2–1–0, is the following points table possible? 14,12,10,8,6,4,2,0', 'Yes'),
];

const set8 = rrSet(8, 'Live qualification', 'Qualification in progress', [46, 47]);
set8.questions = [
  rrQ(set8.id, 46, 'Team C has 5 points with 2 matches remaining. The team currently in 4th place has 11 points and has completed all its matches. Can Team C qualify?', 'No'),
  rrQ(set8.id, 47, 'Team D is currently 5th with 9 points and has 1 match remaining. The 4th-place team has 9 points and has finished all its matches. Team D plays Team E, who has 7 points and has also finished. What result(s) in Team D’s final match allow D to qualify?', 'Win or draw definitely qualifies; loss leaves a tie and therefore depends on the tie-break'),
];

const set9 = rrSet(9, 'Can / Cannot / Must', 'Qualification possibility', [50, 51, 52], economy210);
set9.questions = [
  rrQ(set9.id, 50, 'In an 8-team round robin under 2–1–0, Team H finishes with 8 points.\na) Can Team H qualify for the top 4?\nb) Can Team H fail to qualify?\nc) Must Team H qualify?', 'a) Yes  b) Yes  c) No'),
  rrQ(set9.id, 51, 'In an 8-team round robin under 2–1–0, Team I finishes with 13 points.\na) Can Team I fail to qualify?\nb) Must Team I finish 1st?', 'a) No  b) No'),
  rrQ(set9.id, 52, 'In an 8-team round robin under 2–1–0, Team J finishes with 4 points.\na) Can Team J qualify?\nb) Must Team J fail to qualify?', 'a) Yes  b) No'),
];

export const roundRobinSets: SetData[] = [set1, set2, set3, set4, set5, set6, set7, set8, set9];
export const roundRobinQuestions = roundRobinSets.flatMap(s => s.questions);
export const roundRobinChapter: ChapterData = {
  id: 'round-robin-master',
  title: 'Round Robin',
  level: '35-Question Master Set',
  description: 'Round Robin — 35-Question Master Set',
  sets: roundRobinSets,
  questions: roundRobinQuestions,
};
