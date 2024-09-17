import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";

const Navbar = () => {
  const { query, handleSearch, setQuery, logout } = useContext(AppContext);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar">
      <h1>
        Friends<span>Forever</span>
      </h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="search"
          placeholder="Search for friends..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`menu_li ${isMenuOpen ? "open" : ""}`}>
        <span>
          <Link to="/home">Home</Link>
        </span>
        <span>
          <Link to="/friend">Friend</Link>
        </span>
        <span>
          <Link to="/requests">
            <img src="/bellIcon.jpeg" alt="Notifications" />
          </Link>
        </span>
        <span className="logout" onClick={handleLogout}>
          Logout
        </span>
      </div>
    </div>
  );
};

export default Navbar;
