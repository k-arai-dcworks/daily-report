import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { IoMdSend } from "react-icons/io";
import { IconContext } from "react-icons";
import { FiPlusCircle } from "react-icons/fi";
import "./App.css";

import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import WorkTextbox from "./components/WorkTextbox";

function App() {
  // =========================
  // state管理
  // =========================
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState([]);
  const [works, setWorks] = useState([]);

  // =========================
  // DB取得処理
  // =========================
  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error("fetchTasks error:", e);
    }
  };

  // 初回ロード時に取得
  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // ログイン確認
  // =========================
  const checkLogin = async () => {
    try {
      const res = await fetch("http://localhost:8080/mail/me", {
        method: "GET",
        credentials: "include",
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  };

  // =========================
  // メール送信
  // =========================
  const sendMail = async () => {
    const isLogin = await checkLogin();

    if (!isLogin) {
      sessionStorage.setItem("draftMail", text);
      window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
      return;
    }

    await fetch("http://localhost:8080/mail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });
  };

  // =========================
  // 業務内容UI
  // =========================
  const openWindow = () => {
    setWorks((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  const updateWork = (id, value) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, text: value } : w)),
    );
  };

  // =========================
  // ログイン後処理（下書き送信）
  // =========================
  useEffect(() => {
    const runAfterLogin = async () => {
      try {
        const res = await fetch("http://localhost:8080/mail/me", {
          credentials: "include",
        });

        if (!res.ok) return;

        const draft = sessionStorage.getItem("draftMail");
        if (!draft) return;

        await fetch("http://localhost:8080/mail/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ text: draft }),
        });

        sessionStorage.removeItem("draftMail");
      } catch (e) {
        console.error("runAfterLogin error:", e);
      }
    };

    runAfterLogin();
  }, []);

  // =========================
  // 画面表示
  // =========================
  return (
    <div className="container">
      <h1 className="Title">Daily Report Web</h1>

      <div style={{ padding: "20px" }}>
        {/* タスク追加 */}
        <TaskForm onAdd={fetchTasks} />

        {/* タスク一覧 */}
        <TaskList tasks={tasks} onDelete={fetchTasks} />
      </div>

      {/* 業務内容エリア */}
      <div className="form-area">
        <label className="mail-work">
          <span className="textbox-5-label">業務内容</span>
          <div>
            <IconContext.Provider value={{ size: "33px" }}>
              <button className="work-add-button" onClick={openWindow}>
                <FiPlusCircle />
              </button>
            </IconContext.Provider>
          </div>
        </label>

        <div>
          {works.map((w) => (
            <WorkTextbox
              key={w.id}
              value={w.text}
              onChange={(e) => updateWork(w.id, e.target.value)}
            />
          ))}
        </div>

        {/* 本文 */}
        <label>
          <span className="textbox-5-label">本文</span>
          <textarea
            className="textbox-5"
            placeholder="本文を入力"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>

        {/* 送信 */}
        <IconContext.Provider value={{ color: "#323131", size: "30px" }}>
          <button className="send-button" onClick={sendMail}>
            <IoMdSend />
          </button>
        </IconContext.Provider>
      </div>
    </div>
  );
}

export default App;
