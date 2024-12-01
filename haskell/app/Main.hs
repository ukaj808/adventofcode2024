module Main where

import Text.Megaparsec
import Text.Megaparsec.Char
import Data.Void
import Data.List

type Parser = Parsec Void String

parseNumber :: Parser Int
parseNumber = read <$> many digitChar

parseSpaces :: Parser ()
parseSpaces = skipMany spaceChar

parseNewline :: Parser ()
parseNewline = skipMany newline

parseLine :: Parser (Int, Int)
parseLine = do
  x <- parseNumber
  _ <- parseSpaces
  y <- parseNumber
  _ <- parseNewline
  return (x, y)

parseInput :: Parser ([Int], [Int])
parseInput = do
  lns <- manyTill parseLine eof
  return $ foldr (\(x, y) (xs, ys) -> (x:xs, y:ys)) ([], []) lns

sortAndPair :: ([Int], [Int]) -> [(Int, Int)]
sortAndPair (xs, ys) = zip (sort xs) (sort ys)

totalDist :: [(Int, Int)] -> Int
totalDist xs = sum $ map (\(x, y) -> abs (x - y)) xs

countOccurs :: Int -> [Int] -> Int
countOccurs f xs = length $ filter (== f) xs

simScore :: ([Int], [Int]) -> Int
simScore xs = sum $ map (\x -> x * (countOccurs x (snd xs))) (fst xs)

main :: IO ()
main = do
  day1Input <- readFile "/Users/fisnik.ukaj/adventofcode2024/inputs/day-1-input.txt"
  let parsedInput = parse parseInput "day-1-input.txt" day1Input
  case parsedInput of
    Left err -> print err
    Right (xs, ys) -> do
      let paired = sortAndPair (xs, ys)
      print $ "Day 1 Part 1: " ++ show (totalDist paired)
      print $ "Day 1 Part 2: " ++ show (simScore (xs, ys))
