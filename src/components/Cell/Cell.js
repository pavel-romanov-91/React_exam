import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {  setBlock, setFollowing, setGameResult, setHit, setStatus} from "../../redux/actions/actionCreators";
import { setComputerShot } from "../../redux/actions/actionCreatorsPC";
import cn from "classnames";
import withField from "../../HOCS/withField";
import s from "./Cell.module.scss";

const Cell = ( { cellId }) => {
  const dispatch = useDispatch()
  const [isMiss, setMiss] = useState(false)
  const { ships, shipCount, isBlock, isLost } = useSelector(state => state.game)
  const isHit = useSelector( state => {
    const { ships } = state.game
    const ship = ships.find( ship => ship.location.includes(cellId))
    if (ship) {
      const partOfShip = ship.location.indexOf(cellId)
      return ship.hit[partOfShip]
    }
  })
  const { ships: computerShips, shipCount: computerShipCount } = useSelector(state => state.computer)
  const isDead = useSelector( state => {
      const { ships } = state.game
      const ship = ships.find( ship => ship.location.includes(cellId))
      return ship && ship.dead
  })
  useEffect( () => {
    if(shipCount === 0) {
      dispatch(setGameResult('You win!')) 
    }
  }, [shipCount])
  const handleCellClick = (event) => {
    event.stopPropagation()
    if(isLost || isBlock || !shipCount || isMiss) 
    return
    setMiss(!isMiss)
    const cellId = event.target.dataset.id
    dispatch( setStatus('shot') ) 
    const res = dispatch( setHit(ships, shipCount, cellId) )
    if(!res) {
      dispatch(setFollowing('Computer')) 
      dispatch( setBlock() ) 
      setShotPc(computerShips, computerShipCount) 
    }
  }
  const setShotPc = (computerShips, computerShipCount) => {
   setTimeout( () => {
     const { res, data } = dispatch( setComputerShot(computerShips) )
     if(res && computerShipCount !== 0) {
       return setShotPc(data)
     }
   }, 300)
  }
  return (
    <td
      className={ cn(
          s.cell,
          { [s.cell_miss]: isMiss },
          { [s.cell_hit]: isHit },
          { [s.cell_dead]: isDead }
        )}
      data-id={cellId}
      onClick={ handleCellClick }
    />
  )
}

export default withField( React.memo(Cell) )