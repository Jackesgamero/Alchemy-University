import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import BlockExplorerPage from "./BlockExplorerPage";
import NFTPage from "./NFTPage";
import AccountsPage from "./AccountsPage";
import "./styles.css";

function App() {
  return (
    <Router>
      <nav className="navbar">
        <Link to="/" className="nav-item">Block Explorer</Link>
        <Link to="/nft" className="nav-item">NFT Lookup</Link>
        <Link to="/accounts" className="nav-item">Accounts</Link>
      </nav>

      <Switch>
        <Route exact path="/" component={BlockExplorerPage} />
        <Route path="/nft" component={NFTPage} />
        <Route path="/accounts" component={AccountsPage} />
      </Switch>
    </Router>
  );
}

export default App;
