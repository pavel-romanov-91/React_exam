import React from 'react';
import Field from './components/Field';
import GameLog from './components/GameLog';
import placeShip from './utils/placeShip';
import standardShipsSet from './utils/standardShipsSet';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // playerField: [],
      // playerShips: [],
      // arePlayerShipsInvisible: true,
      enemyField: [],
      enemyShips: [...standardShipsSet],
      areEnemyShipsInvisible: true,
      gameOver: false,
      logs: ['Ожидание хода...'],
    };
    for (let i = 0; i < 10; i++) {
      this.state.enemyField.push([]);
    }
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        this.state.enemyField[i].push({
          x: j,
          y: i,
          containsShip: false,
          shot: false,
          isShipVisible: false,
          shipId: null,
        });
      }
    }
    this.state.enemyShips.forEach(ship => {
      placeShip(this.state.enemyField, ship)
    });
  }
  handleClick(y, x) {
    if (this.state.enemyField[y][x].shot) {
      return
    }
    if (this.state.gameOver) {
      return
    }
    this.setState(state => {
      const newField = [...state.enemyField];
      newField[y][x].shot = true;
      newField[y][x].isShipVisible = true;
      const newShips = [...state.enemyShips];
      const newLogs = [...state.logs];
      let gameOver = false;
      if (newField[y][x].containsShip) {
        const hittedShip = newShips.find(ship => (ship.id === newField[y][x].shipId));
        hittedShip.hitpoints--;
        if (hittedShip.hitpoints > 0) {
          newLogs.push('Попадание!');
        } else {
          newLogs.push('Корабль уничтожен!');
        }
        if (newShips.every(ship => (ship.hitpoints === 0))) {
          newLogs.push('Игра окончена.');
          gameOver = true;
        }
      } else {
        newLogs.push('Мимо!');
      }
      return {
        enemyField: newField,
        enemyShips: newShips,
        gameOver: gameOver,
        logs: newLogs,
      }
    })
  }
  render() {
    return (
      <div className="game">
        {/* <Field whose="player" fieldMap={this.state.playerField} /> */}
        <Field 
        whose="enemy" 
        fieldMap={this.state.enemyField} 
        onClick={(y, x) => this.handleClick(y, x)}
        />
        <GameLog logs={this.state.logs} />
      </div>
    );
  }
}

export default Game;
