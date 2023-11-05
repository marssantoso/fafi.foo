import {useEffect} from 'react'
import localForage from "localforage";
import { useSelector, useDispatch } from 'react-redux'
import { setPlayerName } from '~/store/playerName'

export const usePlayerName = (): [string, (v: string | null) => { payload: string }] => {
  const dispatch = useDispatch()
  const playerName = useSelector<{ playerName: { value: string }}, string>((state) => state.playerName.value)

  useEffect(() => {
    localForage.getItem<string>('playerName').then((v) => dispatch(setPlayerName(v)))
  }, [dispatch]);

  return [playerName, (v: string | null) => dispatch(setPlayerName(v))]
}
