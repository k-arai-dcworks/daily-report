import { useState } from "react";
import { FaPlus } from "react-icons/fa6";

function TaskForm({ onAdd }) {
  const [text, setText] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault(); // フォーム送信時のページリロードを防ぐ

    await fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    setText(""); // 入力リセット
    onAdd(); // 親に更新を促す
  };

  return (
    <form className="mail-work-task" onSubmit={handleSubmit}>
      <input
        className="mail-work-input"
        placeholder="業務内容を入力"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="addTask-btn" type="submit">
        <FaPlus size={30} />
      </button>
    </form>
  );
}

export default TaskForm;
