import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>HomePage</h1>
      <nav>
        <Link to="Dashboard">Dashboard</Link> ||
        <Link to="Login">Login</Link>
      </nav>
    </div>
  );
}

export default HomePage;
