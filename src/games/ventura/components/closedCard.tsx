import React from 'react'
import styles from './styles.module.css'

interface Props {
  children?: string | React.JSX.Element
  isSmall?: boolean
  onClick?: () => void
}

const ClosedCard = (props: Props) => {
  return <div className={`${styles.card} ${styles['card--closed']} ${props.isSmall ? styles['card--small'] : ''}`} onClick={props.onClick}>
    <span className={styles['card__text']}>{props.children}</span>
  </div>
}

export default ClosedCard
