import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import { Auth, Hub } from "aws-amplify";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    Hub.listen("auth", ({ payload: { event, data } }) => {
      switch (event) {
        case "signIn":
        case "cognitoHostedUI":
          getUser().then((userData) => setUser(userData));
          break;
        case "signOut":
          setUser(null);
          break;
        case "signIn_failure":
        case "cognitoHostedUI_failure":
          console.log("Sign in failure", data);
          break;
        default:
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);

  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log("Not signed in"));
  }

  const username = "bannonta@amazon.com";
  const password = "testtest";
  async function signIn() {
    try {
      const user = await Auth.signIn(username, password);
    } catch (error) {
      console.log("error signing in", error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={() => Auth.federatedSignIn()}>Launch Hosted UI</button>
        <button onClick={() => signIn()}>Sign In</button>
        <button onClick={() => Auth.federatedSignIn({ provider: "Google" })}>
          Launch Google
        </button>
        <button onClick={() => Auth.signOut()}>Sign Out</button>
        <div>{JSON.stringify(user, null, 2)}</div>
      </header>
    </div>
  );
}

export default App;
