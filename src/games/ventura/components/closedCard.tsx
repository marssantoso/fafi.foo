import React from 'react'
import styles from './styles.module.css'

interface Props {
  children?: string | React.JSX.Element
  onClick?: () => void
}

const ClosedCard = (props: Props) => {
  return <div className={`${styles.card} ${styles['card--closed']}`} onClick={props.onClick}>
    <span className={styles['card__text']}>{props.children}</span>
  </div>
}

export default ClosedCard
