import "./config/fcl";
import './App.css';
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import Home from "./Home";
import Navbar from "./Navbar"
import Footer from "./Footer"
import Stats from "./Stats"
import Founder from "./Founder"
import { ChakraProvider, Box } from "@chakra-ui/react"
function App() {
  const [user, setUser] = useState({ loggedIn: null })

  useEffect(() => fcl.currentUser.subscribe(setUser), [])

  return (
    <ChakraProvider>
      <Navbar />
      <Home />
      <Founder />
      <Box mb="24">
        <Stats />
      </Box>
      <Footer />
    </ChakraProvider>
  );
}

export default App;
