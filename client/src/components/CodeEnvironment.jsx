import React, { useEffect, useContext, useState } from "react";
import { Outlet, redirect, useParams ,useNavigate } from "react-router-dom";
import { Box, Stack, Button, Chip } from "@mui/material";
import CodeEditor from "./CodeEditor";
import CodeEditorTop from "./sub-components/CodeEditorTop";
import Header from "./sub-components/Header";
import Drawer from "./sub-components/Drawer";
import FriendCodeEditor from "./FriendCodeEditor";
import Output from "./Output";
import CreateRoom from "./CreateRoom";
import CodeEditorContext from "../context/CodeEditorContext";
import problems from "../Data/problems";
import GlobalContext from "../context/GlobalContext";
import LoginToContinue from "./sub-components/LoginToContinue";
import LoginForm from "./LoginForm";
const { io } = require("socket.io-client");

const CodeEnviornment = () => {
  const { problemId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isCredentialsEntered, setIsCredentialsEntered] = useState(false);
  const [socket, setSocket] = useState(null);
  const [friendText, setFriendText] = useState("");
  const [friendLanguage, setFriendLanguage] = useState("cpp");
  const { roomCreated, setRoomCreated } = useContext(CodeEditorContext);
  const { input1, setInput1 } = useContext(CodeEditorContext);
  const { input2, setInput2 } = useContext(CodeEditorContext);

  const { loggedIn, setLoggedIn } = useContext(GlobalContext);
  const [showModal2, setShowModal2] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const navigate = useNavigate();

  let problemIndex = 0;
  for (let i = 0; i < problems.length; i++) {
    if (problems[i].id === parseInt(problemId)) {
      problemIndex = i;
      break;
    }
  }
  const problem = problems[problemIndex];

  setInput1(problem["testCases"][0]["inputs"][0]["value"]);
  setInput2(problem["testCases"][1]["inputs"][0]["value"]);

  const connectToRoom = () => {
    if (displayName.trim() === "" || roomId.trim() === "") {
      alert("Please enter a display name and room ID");
      return;
    }

    const newSocket = io("http://localhost:5000"); // Replace with your server address
    setSocket(newSocket);

    // Emit 'joinRoom' event to the server with display name and room ID
    newSocket.emit("joinRoom", { displayName, roomId });
    console.log("Connected to room", roomId);
    setShowModal(false);
    setRoomCreated(true);
  };

  const handleCreateRoom = () => {
    if (loggedIn) {
      setShowModal(true);
    } else {
      setShowModal2(true);
    }
  };














  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("message", (data) => {
        const { displayName: userName, message } = data;
        if (userName !== displayName) {
          setFriendText(message);
        }
      });

      socket.on("language", (data) => {
        const { displayName: userName, language } = data;
        if (userName !== displayName) {
          setFriendLanguage(language);
        }
      });
    }
  }, [socket]);





  useEffect(() => {
    (function () {
      "use strict";

      // horizontal direction
      (function resizableX() {
        const resizer = document.querySelector(".resizer-x");
        resizer.addEventListener("mousedown", onmousedown);
        resizer.addEventListener("touchstart", ontouchstart);

        // for mobile
        function ontouchstart(e) {
          e.preventDefault();
          resizer.addEventListener("touchmove", ontouchmove);
          resizer.addEventListener("touchend", ontouchend);
        }
        function ontouchmove(e) {
          e.preventDefault();
          const clientX = e.touches[0].clientX;
          const deltaX = clientX - (resizer._clientX || clientX);
          resizer._clientX = clientX;
          const l = resizer.previousElementSibling;
          const r = resizer.nextElementSibling;
          // LEFT
          if (deltaX < 0) {
            const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
            l.style.flex = `0 ${w < 10 ? 0 : w}px`;
            r.style.flex = "1 0";
          }
          // RIGHT
          if (deltaX > 0) {
            const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
            r.style.flex = `0 ${w < 10 ? 0 : w}px`;
            l.style.flex = "1 0";
          }
        }
        function ontouchend(e) {
          e.preventDefault();
          resizer.removeEventListener("touchmove", ontouchmove);
          resizer.removeEventListener("touchend", ontouchend);
          delete e._clientX;
        }

        // for desktop
        function onmousedown(e) {
          e.preventDefault();
          document.addEventListener("mousemove", onmousemove);
          document.addEventListener("mouseup", onmouseup);
        }
        function onmousemove(e) {
          e.preventDefault();
          const clientX = e.clientX;
          const deltaX = clientX - (resizer._clientX || clientX);
          resizer._clientX = clientX;
          const l = resizer.previousElementSibling;
          const r = resizer.nextElementSibling;
          // LEFT
          if (deltaX < 0) {
            const w = Math.round(parseInt(getComputedStyle(l).width) + deltaX);
            l.style.flex = `0 ${w < 10 ? 0 : w}px`;
            r.style.flex = "1 0";
          }
          // RIGHT
          if (deltaX > 0) {
            const w = Math.round(parseInt(getComputedStyle(r).width) - deltaX);
            r.style.flex = `0 ${w < 10 ? 0 : w}px`;
            l.style.flex = "1 0";
          }
        }
        function onmouseup(e) {
          e.preventDefault();
          document.removeEventListener("mousemove", onmousemove);
          document.removeEventListener("mouseup", onmouseup);
          delete e._clientX;
        }
      })();

      // vertical direction
      // (function resizableY() {
      //   const resizer = document.querySelector(".resizer-y");
      //   resizer.addEventListener("mousedown", onmousedown);
      //   resizer.addEventListener("touchstart", ontouchstart);

      //   // for mobile
      //   function ontouchstart(e) {
      //     e.preventDefault();
      //     resizer.addEventListener("touchmove", ontouchmove);
      //     resizer.addEventListener("touchend", ontouchend);
      //   }
      //   function ontouchmove(e) {
      //     e.preventDefault();
      //     const clientY = e.touches[0].clientY;
      //     const deltaY = clientY - (resizer._clientY || clientY);
      //     resizer._clientY = clientY;
      //     const t = resizer.previousElementSibling;
      //     const b = resizer.nextElementSibling;
      //     // UP
      //     if (deltaY < 0) {
      //       const h = Math.round(parseInt(getComputedStyle(t).height) + deltaY);
      //       t.style.flex = `0 ${h < 10 ? 0 : h}px`;
      //       b.style.flex = "1 0";
      //     }
      //     // DOWN
      //     if (deltaY > 0) {
      //       const h = Math.round(parseInt(getComputedStyle(b).height) - deltaY);
      //       b.style.flex = `0 ${h < 10 ? 0 : h}px`;
      //       t.style.flex = "1 0";
      //     }
      //   }
      //   function ontouchend(e) {
      //     e.preventDefault();
      //     resizer.removeEventListener("touchmove", ontouchmove);
      //     resizer.removeEventListener("touchend", ontouchend);
      //     delete e._clientY;
      //   }

      //   // for desktop
      //   function onmousedown(e) {
      //     e.preventDefault();
      //     document.addEventListener("mousemove", onmousemove);
      //     document.addEventListener("mouseup", onmouseup);
      //   }
      //   function onmousemove(e) {
      //     e.preventDefault();
      //     const clientY = e.clientY;
      //     const deltaY = clientY - (resizer._clientY || clientY);
      //     resizer._clientY = clientY;
      //     const t = resizer.previousElementSibling;
      //     const b = resizer.nextElementSibling;
      //     // UP
      //     if (deltaY < 0) {
      //       const h = Math.round(parseInt(getComputedStyle(t).height) + deltaY);
      //       t.style.flex = `0 ${h < 10 ? 0 : h}px`;
      //       b.style.flex = "1 0";
      //     }
      //     // DOWN
      //     if (deltaY > 0) {
      //       const h = Math.round(parseInt(getComputedStyle(b).height) - deltaY);
      //       b.style.flex = `0 ${h < 10 ? 0 : h}px`;
      //       t.style.flex = "1 0";
      //     }
      //   }
      //   function onmouseup(e) {
      //     e.preventDefault();
      //     document.removeEventListener("mousemove", onmousemove);
      //     document.removeEventListener("mouseup", onmouseup);
      //     delete e._clientY;
      //   }
      // })();
    })();

  }, []);









  return (
    <>


      {showLoginForm && <LoginForm />}
      {/* <LoginForm isOpen={showLoginForm} /> */}
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="absolute right-0 p-4">
        {" "}
        {/* Use Tailwind CSS classes to style the container */}
        {!socket && (
          <Button
            //white text, blue background, rounded corners, padding 2px, border 1px solid blue
            sx={{
              color: "white", background: "#1976d2",
              '&:hover': {
                background: "#225281",
              }, borderRadius: "8px", p: 1, border: "1px solid #1e1e1e",
            }}

            onClick={() => handleCreateRoom()} variant="outlined">
            Create Room
          </Button>

          // same button with tailwind classes
          // <button
          //   className="text-white bg-blue-500 rounded px-2 border border-blue-500 "
          //   onClick={() => handleCreateRoom()}
          // />

        )}
        <LoginToContinue
          isOpen={showModal2}
          onClose={() => setShowModal2(false)}
          onLogin={() => {
            navigate("/login", { replace: true });
            // setShowModal(true);

            // {showLoginForm && <LoginForm />}
          }}
        />
        <CreateRoom
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onCreateRoom={connectToRoom}
          displayName={displayName}
          setDisplayName={setDisplayName}
          roomId={roomId}
          setRoomId={setRoomId}
        />
      </div>{" "}


      <h3 className="text-3xl my-3 mx-10"> {problem["title"]} </h3>
      <Stack
        direction={{
          direction: "row",
          xs: "column",
          sm: "column",
          md: "row",
        }}
        spacing={{ xs: 1, sm: 2, md: 2 }}
        padding={{ xs: 1, sm: 2, md: 2 }}
        className="resizable-x"
      >

        <div id="app">
          <div className="resizable-x">
            <div className="div0" style={{ flex: "40%" }}>
              {/* <p>div 0</p> */}

              {/* <Box
          sx={{
            px: { md: 2 },
            width: { sx: "auto", md: "40vw" },
            backgroundColor: "#1e1e1e",
            color: "white",
            borderRadius: "8px",
          }}
          className="div0"
        > */}
              <div>
                <p
                  className={`text-sm font-bold px-6 py-4 whitespace-nowrap ${problem.difficulty === "Easy"
                    ? "text-green-500"
                    : problem.difficulty === "Medium"
                      ? "text-yellow-500"
                      : "text-red-500"
                    }`}
                >
                  {problem["difficulty"]}
                </p>
                <p className="">
                  {problem["tags"].map((tag, index) => (
                    <Chip
                      key={index}
                      className="bg-gray m-1"
                      variant="outlined"
                      label={tag}
                      sx={{ color: "white" }}
                    />
                  ))}
                </p>
                <br />
                <p>{problem["description"]}</p>
                <br />
                <p className="text-slate-400">
                  {problem["example"].split(" ").map((word, index) => (
                    <span key={index}>
                      {["input:", "output:", "explanation:"].includes(
                        word.toLowerCase()
                      ) && <strong className="block text-white">{word}</strong>}
                      {["input:", "output:", "explanation:"].includes(
                        word.toLowerCase()
                      )
                        ? null
                        : " " + word}
                    </span>
                  ))}
                </p>
              </div>
              {/* </Box> */}
            </div>
            <div className="resizer-x" />
            <div className="resizable-y" style={{ flex: "60%" }}>
              <div className="div1" style={{ flex: "100%" }}>
                {/* <p>div 1</p> */}
                {/* <Box
          sx={{
            width: "100%",
          }}
          className="div1"
        > */}
                <CodeEditorTop
                  socket={socket}
                  roomId={roomId}
                  displayName={displayName}
                />
                <CodeEditor
                  socket={socket}
                  roomId={roomId}
                  displayName={displayName}
                />
                <Output />

                {/* </Box> */}
              </div>
            </div>
          </div>
        </div>


      </Stack>
      <Drawer isOpen={isOpen} setIsOpen={setIsOpen} language={friendLanguage}>
        <FriendCodeEditor friendText={friendText} language={friendLanguage} />
      </Drawer>

    </>
  );
};

export default CodeEnviornment;
