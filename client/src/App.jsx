import './App.scss';
import { useState, useEffect } from "react";
import { getCreatures } from "./services/creatureServices";

function App() {

  //constants

  //sets creatures state
  const [creatures, setCreatures] = useState([]);

  //functions

  //retrieves creatures on load
  const loadAsyncData = async () => {
    try {
      const { data } = await getCreatures();
      setCreatures(data);
    } catch (error) {
      console.log(error);
    }
  }


  //calls data retrieval on load
  useEffect(() => {

    loadAsyncData();

  }, []);

  return (
    <>

      <div>
        <h1>Hello World</h1>
      </div>

      <div>
        {creatures.map((creature) => (
          <div
            key={creature._id}
          >
            {creature.name}
          </div>
        ))}
      </div>

    </>
  );
}

export default App;
