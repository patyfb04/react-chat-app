import { Routes, Route } from "react-router";
import ChatRoom from "../pages/ChatRoom";
import RoomList from "../pages/RoomList";
import CreateRoom from "../pages/CreateRoom";
import Navbar from "./Navbar";

function Dashboard() {
  return (
    <section
      className="chat-app"
      style={{ color: "white" }}
      data-testid="dashboard"
    >
      <Navbar />
      <Routes>
        <Route index element={<ChatRoom />}></Route>
        <Route path="/rooms-list" element={<RoomList />}></Route>
        <Route path="/create-room" element={<CreateRoom />}></Route>
      </Routes>
    </section>
  );
}
export default Dashboard;
