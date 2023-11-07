import React from 'react'
import styles from './styles.module.css'

interface Props {
  children: React.JSX.Element | React.JSX.Element[]
}

const Card = (props: Props) => {
  return <div className={styles.card}>{props.children}</div>
}

export default Card
