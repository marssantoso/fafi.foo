import React from 'react'
import styles from './styles.module.css'
import type { ActionCard, PointCard, OnClickCard } from '../types'

interface Props {
  children: React.JSX.Element | React.JSX.Element[]
  onClick?: OnClickCard<ActionCard> | OnClickCard<PointCard>
  isSmall?: boolean
}

const Card = (props: Props) => {
  return (
    <div className={`${styles.card} ${props.isSmall ? styles['card--small'] : ''}`} onClick={() => props.onClick && props.onClick()}>
      {props.children}
    </div>
  )
}

export default Card
