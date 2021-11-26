import { useEffect, useState } from "react";
import './App.scss';
import Userfront from "@userfront/react";
import { Navigate } from "react-router-dom";
import { getUsers, addUser } from './services/userServices';

Userfront.init("rbvqd5nd");

const LogoutButton = Userfront.build({ toolId: "rodmkm" });

function App() {

  const [user, setUser] = useState([]);

  const [userfrontId, setUserfrontId] = useState(0);

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

  const loadAsyncData = async () => {
    try {
      const { data } = await getUsers();
      setUserfrontId(Userfront.user.userId);
      const userData = data.filter(user => user.userfrontId === userfrontId);
      if (userfrontId !== userData && userfrontId !== 0) {

        const creatureArray = [
          "619fe14576cc938733d9f695",
          "619ff05376cc938733d9f696"
        ];

        const randomCreature = creatureArray[Math.floor(Math.random() * creatureArray.length)];

        const newUser = {
          userfrontId: userfrontId,
          name: Userfront.user.name,
          creature: randomCreature
        }

        addUser(newUser);

      }
      const newUserData = data.filter(user => user.userfrontId === userfrontId);
      setUser(newUserData);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {

    checkAuth();
    loadAsyncData();

  });

  return (
    <>
      <div>
        Home<br />
        <LogoutButton />
      </div>

      <div>
        {user.map((user) => (
          <div>
            {user.name}<br />
            <img src={user.creature.img_path} alt={user.creature.name} />
          </div>
        ))}
      </div>

    </>
  );
}

export default App;
