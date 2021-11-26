import { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers, addUser } from './services/userServices';
import { getCreatures } from './services/creatureServices';

// initialize Userfront
Userfront.init("rbvqd5nd");

// initialize logout button
const LogoutButton = Userfront.build({ toolId: "rodmkm" });

// main app component
function App() {
  // sets user and userfront id state
  const [user, setUser] = useState([]);
  const [userfrontId, setUserfrontId] = useState(0);
  // sets creatures 
  const [creatures, setCreatures] = useState([]);
  // sets user creature state
  const [userCreature, setUserCreature] = useState([]);

  // checks for userfront authentication
  const checkAuth = async () => {
    if (!Userfront.accessToken()) {
      return (
        <Navigate
          to={{
            pathname: "/",
            state: { from: window.location },
          }}
        />
      );
    }
  }

  // retrieves creatures
  const loadAsyncDataCreatures = async () => {
    try {
      const { data } = await getCreatures();
      setCreatures(data);
    } catch (error) {
      console.log(error);
    }
  }

  // retrieves user data and then updates user state
  const loadAsyncDataUser = async () => {
    try {
      const { data } = await getUsers();
      setUserfrontId(Userfront.user.userId);
      const userData = data.filter(user => user.userfrontId === userfrontId);

      // checks for user data and generates new user if none exists
      try {
        if (userfrontId !== userData && userfrontId !== 0) {
          const randomCreature = creatures[Math.floor(Math.random() * creatures.length)];
          const newUser = {
            userfrontId: userfrontId,
            name: Userfront.user.name,
            creature: randomCreature
          }
          await addUser(newUser);
        }
      } catch (error) {
        console.log(error);
      }

      const newUserData = data.filter(user => user.userfrontId === userfrontId);
      setUser(newUserData);
    } catch (error) {
      console.log(error);
    }
  }

  // calls authentication and data retrieval on load
  useEffect(() => {
    checkAuth();
    loadAsyncDataCreatures();
    loadAsyncDataUser();
  });

  return (
    <>
      {/* nav */}
      <div>
        <LogoutButton />
      </div>

      {/* user details */}
      <div>
        {user.map((user) => (
          <div
            key={user._id}
          >
            {user.name}<br />
            {user.creature}
          </div>
        ))}
      </div>

      {/* user creature details */}
      <div>
        {userCreature.map((creature) => (
          <div
            key={creature._id}
          >
            <img src={creature.img_path} alt={creature.name} />
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
