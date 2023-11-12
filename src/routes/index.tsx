import { Link } from "react-router-dom";
import Header from "~/components/Header";
// import '../index.css'
// import './index.css'

function Root() {
  return (
    <>
      <Header />
      <h1 className="page__title">fafi.foo</h1>
      <div style={{ textAlign: 'center' }}>
        <Link to="/g">Go to Games</Link>
      </div>
    </>
  )
}

export default Root
