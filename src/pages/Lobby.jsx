import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { PlayerList, LeaveButton, CountdownOverlay } from "../components/LobbyComponents"

const Lobby = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(true);

  return (
    <div style={{ width: '100%', height: '100%', margin: '0 0 0 0' }}>
      {countdown && <CountdownOverlay onComplete={() => {setCountdown(false); navigate('/home')}} allPlayers={["John", "Jane", "Jim", "Jill", "Jack", "Jenny", "Joe", "Jade"]} teamPlayers={["John", "Jane", "Jim", "Jill"]} />}
      <PlayerList players={["John", "Jane", "Jim", "Jill", "Jack", "Jenny", "Joe", "Jade"]} />
      <LeaveButton />
    </div>
  );
};

export default Lobby;
