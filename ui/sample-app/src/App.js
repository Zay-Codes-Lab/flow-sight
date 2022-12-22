import "./config/fcl";
import './App.css';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import Home from "./Home";
import Navbar from "./Navbar"
import { ChakraProvider } from "@chakra-ui/react"

function App() {
  const [user, setUser] = useState({ loggedIn: null })

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  const AuthedState = () => {
    return (
      <div>
        <div>Address: {user?.addr ?? "No Address"}</div>
        <button onClick={fcl.unauthenticate}>Log Out</button>
      </div>
    )
  }

  const UnauthenticatedState = () => {
    return (
      <div>
        <button onClick={fcl.logIn}>Log In</button>
        <button onClick={fcl.signUp}>Sign Up</button>
      </div>
    )
  }

  return (
    <ChakraProvider>
      <Navbar />
      <Home />
    </ChakraProvider>
  );
}

export default App;
