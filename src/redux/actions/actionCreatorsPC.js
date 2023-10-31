import {
  RESET_PC, SET_PC_SETTINGS, SET_PC_SHIP_MINUS_COUNT,
  SET_PC_SHOT, SET_PC_SHOT_DEAD, SET_PC_SHOT_MISS, SET_SHIP
} from "./actionPcTypes";
import { isUsedId } from "../../constants/constants";
import { setBlock, setFollowing } from "./actionCreators";
import {findNeedShip, generateModifyShipArray} from "../../utils/support";

export const setPcSettings = (pcOptions) => {
  return {
    type: SET_PC_SETTINGS,
    payload: pcOptions
  }
}
export const resetPc = () => {
  return {
    type: RESET_PC
  }
}
export const setPcShot = (ships, cell) => {
  return {
    type: SET_PC_SHOT,
    payload: {
      ships,
      cell
    }
  }
}
export const setPcShipDead = (ships, cell) => {
  return {
    type: SET_PC_SHOT_DEAD,
    payload: {
      ships,
      cell
    }
  }
}
export const setPcShipMinusCount = () => {
  return {
    type: SET_PC_SHIP_MINUS_COUNT,
  }
}
export const setPcShipMiss = (cell) => {
  return {
    type: SET_PC_SHOT_MISS,
    payload: cell
  }
}
export const setShip = (ships) => {
  return {
    type: SET_SHIP,
    payload: ships
  }
}
export const setShipOptions = (ships, shipsEx) => {
  return (dispatch) => {
    if(ships.length > 0) {
      if(shipsEx.length === 0) {
        let shipCells = []
        const newShips = [...ships]
        newShips.forEach( (ship) => {
          ship.location.forEach( coordinate => {
            shipCells.push(coordinate)
          })
        })
        dispatch( setShip(shipCells) ) 
      }
    }
  }
}
export const setComputerShot = (ships) => {
  const id = getRandomId()
  if(isUsedId.includes(id) && isUsedId.length < 100 ) {
    return setComputerShot(ships)
  }
  return (dispatch) => {
    isUsedId.push(id)
    const { ship, shipIndex } = findNeedShip(ships, id)
    if(ship) {
      const partOfShip = ship.location.indexOf(id)
      if(partOfShip >= 0) {
        // const hit = [...ship.hit]
        // hit[partOfShip] = true
        // const newShip = { ...ship, hit}
        // const newShips = [...ships]
        // newShips[shipIndex] = newShip
        const {newShips, newShip, hit} = generateModifyShipArray(ship, shipIndex, partOfShip, ships) 
        dispatch( setPcShot(newShips, {[id]: true}) ) 
        if(!hit.includes('')) {
          newShip.dead = true 
          newShips[shipIndex] = newShip 
          dispatch( setPcShipDead(newShips, {[id]: true}) ) 
          dispatch( setPcShipMinusCount() )
        }
        return {res: true, data: newShips}
      }
    } else {
      dispatch( setPcShipMiss({[id]: true}) ) 
      dispatch( setFollowing('User') ) 
      dispatch( setBlock() ) 
      return false
    }
  }
}
const getRandomId = () => Math.floor(Math.random() * 10) + '' + Math.floor(Math.random() * 10)