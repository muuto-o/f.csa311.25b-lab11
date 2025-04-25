package game;

import java.util.Arrays;

public class GameState {

    private final Cell[] cells;
    private final String currentPlayer;
    private final String winner;

    private GameState(Cell[] cells, String currentPlayer, String winner) {
        this.cells = cells;
        this.currentPlayer = currentPlayer;
        this.winner = winner;
    }

    public static GameState forGame(Game game) {
        Cell[] cells = getCells(game);
        String currentPlayer = game.getPlayer() == Player.PLAYER0 ? "X" : "O";
        String winner = game.getWinner() == null ? "" : (game.getWinner() == Player.PLAYER0 ? "X" : "O");
        return new GameState(cells, currentPlayer, winner);
    }

    public Cell[] getCells() {
        return this.cells;
    }

    /**
     * toString() of GameState will return the string representing
     * the GameState in JSON format.
     */
    @Override
    public String toString() {
        return """
                {
                  "cells": %s,
                  "currentPlayer": "%s",
                  "winner": "%s"
                }
                """.formatted(Arrays.toString(this.cells), this.currentPlayer, this.winner);
    }

    private static Cell[] getCells(Game game) {
        Cell cells[] = new Cell[9];
        Board board = game.getBoard();
        for (int x = 0; x <= 2; x++) {
            for (int y = 0; y <= 2; y++) {
                String text = "";
                boolean playable = false;
                Player player = board.getCell(x, y);
                if (player == Player.PLAYER0)
                    text = "X";
                else if (player == Player.PLAYER1)
                    text = "O";
                else if (player == null) {
                    playable = true;
                }
                cells[3 * y + x] = new Cell(x, y, text, playable);
            }
        }
        return cells;
    }
}

class Cell {
    private final int x;
    private final int y;
    private final String text;
    private final boolean playable;

    Cell(int x, int y, String text, boolean playable) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.playable = playable;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }

    public String getText() {
        return this.text;
    }

    public boolean isPlayable() {
        return this.playable;
    }

    @Override
    public String toString() {
        return """
                {
                    "text": "%s",
                    "playable": %b,
                    "x": %d,
                    "y": %d
                }
                """.formatted(this.text, this.playable, this.x, this.y);
    }
}