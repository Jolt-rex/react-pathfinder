import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Pathfinder from './components/pathfinder';

function App() {
  return (
    <div className="App">
      <h1 className="heading">Pathfinder</h1>
      <Pathfinder height={15} width={30} />
    </div>
  );
}

export default App;
