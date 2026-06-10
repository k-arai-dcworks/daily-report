import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import { IoMdSend } from "react-icons/io";
import "./App.css";
import { IconContext } from "react-icons";
import { FiPlusCircle } from "react-icons/fi";

import { useEffect } from "react";

function App() {
  // setTextで文字を入れる
  const [text, setText] = useState("");

  // ログイン確認
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

  // メール送信
  const sendMail = async () => {
    // ログイン確認
    const isLogin = await checkLogin();

    // 未ログイン時の処理
    if (!isLogin) {
      sessionStorage.setItem("draftMail", text); // 入力保持

      window.location.href =
        "http://localhost:8080/oauth2/authorization/google";
      return;
    }

    // ログイン済み時の処理
    const res = await fetch("http://localhost:8080/mail/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    console.log(await res.text());
  };

  // 業務内容格納
  const [works, setWorks] = useState([]);

  // 業務内容ボタン押下時
  const openWindow = () => {
    setWorks((prev) => [...prev, { id: Date.now(), text: "" }]);
  };

  // 更新
  const updateWork = (id, value) => {
    setWorks((prev) =>
      prev.map((w) => (w.id === id ? { ...w, text: value } : w)),
    );
  };

  // ログイン後処理
  useEffect(() => {
    const runAfterLogin = async () => {
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
    };

    runAfterLogin();
  }, []);

const res = await fetch("http://localhost:8080/api/tasks");
const data = await res.json();
console.log(data);

  // 画面表示
  return (
    <div className="container">
      <h1 className="Title">Daily Report Web</h1>

      {/* 入力・ボタンエリア */}
      <div className="form-area">
        {/* 業務内容エリア */}
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

        {/* 本文エリア */}
        <label>
          <span className="textbox-5-label">本文</span>
          <textarea
            className="textbox-5"
            placeholder="本文を入力"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </label>

        {/* 送信ボタン */}
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
