import React from 'react'
import styles from './styles.module.css'

interface Props {
  children?: string | React.JSX.Element
  type: 'action' | 'point'
  isSmall?: boolean
  onClick?: () => void
}

const ClosedCard = ({ type, isSmall, onClick, children }: Props) => {
  const className = `${styles.card} ${styles['card--closed']} ${isSmall ? styles['card--small'] : ''} ${type === 'point' ? styles['pointCard--closed'] : styles['actionCard--closed']}`
  return (
    <div className={className} onClick={onClick}>
      <span className={styles['card__text']}>{children}</span>
    </div>
  )
}

export default ClosedCard
