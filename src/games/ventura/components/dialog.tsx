import React from 'react'
import styles from './styles.module.css'

interface Props {
  open: boolean
  title: string
  children?: React.JSX.Element | React.JSX.Element[]
  confirmLabel?: string
  closeLabel?: string
  onConfirm?: () => void
  onClose?: () => void
}

const Dialog = (props: Props) => {
  return (
    <>
      <dialog className={styles.dialog} open={props.open}>
        <div className={styles.dialog__wrapper}>
          <header className={styles.dialog__header}>
            <h1 className={styles.dialog__title}>{props.title}</h1>
          </header>
          <main className={styles.dialog__body}>{props.children}</main>
          <footer className={styles.dialog__footer}>
            {props.closeLabel ? <button onClick={props.onClose} className={styles.dialog__close}>{props.closeLabel}</button> : <></>}
            {props.confirmLabel ? <button onClick={props.onConfirm} className={styles.dialog__confirm}>{props.confirmLabel}</button> : <></>}
          </footer>
        </div>
        <div className={styles.dialog__backdrop} />
      </dialog>

      <svg>
        <filter id="wavy">
          <feTurbulence x={0} y={0} baseFrequency={0.02} numOctaves={5} seed={1} />
          <feDisplacementMap in="SourceGraphic" scale={10} />
        </filter>
      </svg>
    </>
  )
}

export default Dialog
