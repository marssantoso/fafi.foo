import React from 'react'
import styles from './styles.module.css'
import type { ActionCard, PointCard, OnClickCard } from '../types'

interface Props {
  children: React.JSX.Element | React.JSX.Element[]
  onClick?: OnClickCard<ActionCard> | OnClickCard<PointCard>
}

const Card = (props: Props) => {
  return <div className={styles.card} onClick={(() => props.onClick && props.onClick())}>{props.children}</div>
}

export default Card
