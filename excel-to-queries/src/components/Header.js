import headerStyles from "../styles/Header";

const Header = () => {
  return (
    <nav className="navbar" data-bs-theme="dark" style={headerStyles.nav}>
      <div className="container-fluid">
        <a className="navbar-brand" href="/">Excel to Queries</a>
      </div>
    </nav>
  );
}

export default Header;
