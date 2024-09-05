# Dice Game

## Description

This is an online dice game with a React front-end and Flask back-end.

## Setup

Download the Repository, inside of ./client start the front-end by typing npm run dev. Inside ./server start the back-end with py main.py.
In Order to play now, open 2 seperate browsers, and then on one browser create a lobby, and on the other join the same lobby.

## Game Rules

### 1. Setup
- Each player starts with 5 dice.
  
### 2. Turns
- The first player makes a guess about how many dice of a certain number are present among all players' dice (e.g., "There are 3 fours").
- The next player has two options: **Increase** or **Doubt and Reveal**.

### 3. Increase
The next player can choose to:
- Increase the total number of dice of the specified number (e.g., "There are 4 fours"), or
- Increase the specified number (e.g., "There are 3 fives").

### 4. Doubt and Reveal
If a player does not want to increase, they can challenge the previous player's guess by saying they **doubt** it. At this point, all dice are revealed and counted:
- If the count of the specified number is equal to or greater than the claimed amount, the doubting player loses one die.
- If the count is less than the claimed amount, the player who made the last claim loses one die.

### 5. Next Round
- The player who lost a die starts the next round.

## Objective
- The objective is to be the last player with dice remaining.
