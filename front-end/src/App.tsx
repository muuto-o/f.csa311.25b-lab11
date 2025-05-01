import React from "react";
import "./App.css"; // import the css file to enable your styles.
import { GameState, Cell } from "./game";
import BoardCell from "./Cell";

/**
 * Define the type of the props field for a React component
 */
interface Props {}

/**
 * Using generics to specify the type of props and state.
 * props and state is a special field in a React component.
 * React will keep track of the value of props and state.
 * Any time there's a change to their values, React will
 * automatically update (not fully re-render) the HTML needed.
 *
 * props and state are similar in the sense that they manage
 * the data of this component. A change to their values will
 * cause the view (HTML) to change accordingly.
 *
 * Usually, props is passed and changed by the parent component;
 * state is the internal value of the component and managed by
 * the component itself.
 */
class App extends React.Component<Props, GameState> {
  private initialized: boolean = false;

  /**
   * @param props has type Props
   */
  constructor(props: Props) {
    super(props);
    /**
     * state has type GameState as specified in the class inheritance.
     */
    this.state = { cells: [], currentPlayer: "", winner: "" };
  }

  /**
   * Use arrow function, i.e., () => {} to create an async function,
   * otherwise, 'this' would become undefined in runtime. This is
   * just an issue of Javascript.
   */
  newGame = async () => {
    const response = await fetch("/newgame");
    const json = await response.json();
    this.setState({
      cells: json["cells"],
      currentPlayer: json["currentPlayer"],
      winner: json["winner"],
    });
  };

  /**
   * play will generate an anonymous function that the component
   * can bind with.
   * @param x
   * @param y
   * @returns
   */
  play(x: number, y: number): React.MouseEventHandler {
    return async (e) => {
      // prevent the default behavior on clicking a link; otherwise, it will jump to a new page.
      e.preventDefault();
      const response = await fetch(`/play?x=${x}&y=${y}`);
      const json = await response.json();
      this.setState({
        cells: json["cells"],
        currentPlayer: json["currentPlayer"],
        winner: json["winner"],
      });
    };
  }

  undo = async () => {
    const response = await fetch("/undo");
    const json = await response.json();
    this.setState({
      cells: json["cells"],
      currentPlayer: json["currentPlayer"],
    });
  };

  createCell(cell: Cell, index: number): React.ReactNode {
    if (cell.playable)
      return (
        <div
          key={index}
          className={`cell-container ${cell.playable ? "playable" : ""}`}
          onClick={this.play(cell.x, cell.y)}
        >
          <BoardCell cell={cell}></BoardCell>
        </div>
      );
    else
      return (
        <div key={index} className="cell-container">
          <BoardCell cell={cell}></BoardCell>
        </div>
      );
  }
  /**
   * This function will call after the HTML is rendered.
   * We update the initial state by creating a new game.
   * @see https://reactjs.org/docs/react-component.html#componentdidmount
   */
  componentDidMount(): void {
    /**
     * setState in DidMount() will cause it to render twice which may cause
     * this function to be invoked twice. Use initialized to avoid that.
     */
    if (!this.initialized) {
      this.newGame();
      this.initialized = true;
    }
  }

  /**
   * The only method you must define in a React.Component subclass.
   * @returns the React element via JSX.
   * @see https://reactjs.org/docs/react-component.html
   */
  render(): React.ReactNode {
    /**
     * We use JSX to define the template. An advantage of JSX is that you
     * can treat HTML elements as code.
     * @see https://reactjs.org/docs/introducing-jsx.html
     */
    return (
      <div className="app-container">
        <div className="header">
          <h1>Tic-Tac-Toe</h1>
          <div className="status">
            {this.state.winner ? (
              <div className="winner-message">
                <span className="winner-text">Winner:</span>
                <span className="winner-name">{this.state.winner}</span>
                <div className="confetti">🎉</div>
              </div>
            ) : (
              <div className="turn-message">
                <span>Current Turn:</span>
                <span className="player-name">{this.state.currentPlayer}</span>
              </div>
            )}
          </div>
        </div>

        <div className="board-container">
          <div className="board">
            {this.state.cells.map((cell, i) => this.createCell(cell, i))}
          </div>
        </div>

        <div className="controls">
          <button onClick={this.newGame} className="control-button new-game">
            New Game
          </button>
          {/* Exercise: implement Undo function */}
          <button
            onClick={this.undo}
            disabled={this.state.winner ? true : false}
            className={`control-button undo &{this.state.winner && }`}
          >
            Undo
          </button>
        </div>
      </div>
    );
  }
}

export default App;
