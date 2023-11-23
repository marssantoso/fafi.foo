import { ActionType } from '../types'
import IconGain from '../assets/action-icon-gain.svg'
import IconExchange from '../assets/action-icon-exchange.svg'
import IconUpgrade from '../assets/action-icon-upgrade.svg'
import styles from './styles.module.css'

interface Props {
  type: ActionType
  isSmall?: boolean
}

const ActionIcon = ({ type, isSmall }: Props) => {
  const icon: Record<ActionType, string> = {
    gain: IconGain,
    exchange: IconExchange,
    upgrade: IconUpgrade,
  }

  return (
    <div className={styles.actionCard__icon}>
      <img src={icon[type]} alt={type} width={isSmall ? 12 : 20} height={isSmall ? 12 : 20} />
    </div>
  )
}

export default ActionIcon
