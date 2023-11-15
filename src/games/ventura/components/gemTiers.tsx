import React from 'react'
import styles from './styles.module.css'

const GemTiers = () => {
  const gems = Array.from(Array(4))
  return (
    <div className={styles.gemTiers}>
      {gems.map((_n, i) => (
        <React.Fragment key={i}>
          <div className={`${styles.gem} ${styles['gem-' + i]}`}></div>
          {i < gems.length - 1 ? <span className={styles.arrow}>→</span> : ''}
        </React.Fragment>
      ))}
    </div>
  )
}

export default GemTiers
