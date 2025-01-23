import React  from "react"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
const Home = () => {
    return (
        <div>
            <h1>HAI CRUD</h1>
          <Link to='/oper' className="btn btn-warning">GO TO CRUD</Link>
        </div>
    )
}

export default Home
