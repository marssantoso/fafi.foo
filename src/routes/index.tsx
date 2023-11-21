import { Link } from "react-router-dom";
import Header from "~/components/Header";
import styles from './index.module.css'

function Root() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.content}>
          <img src="/fafi.foo.svg" alt="fafi.foo" width={256} height={256} />
          <p>A personal collection of turn-based multiplayer board games</p>
          <Link to="/g">Go to Games</Link>
        </div>
      </main>
    </>
  )
}

export default Root
