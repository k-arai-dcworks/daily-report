import { useState } from "react";
import { MdDelete } from "react-icons/md";

function TaskList({ tasks, onDelete, onSelect }) {
  return (
    <div className="mail-work-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          {/* 本体クリック */}
          <button
            className="task-item-content"
            onClick={() => {
              onSelect("・" + task.content);
              
            }}
          >
            {task.content}
          </button>

          {/* 削除ボタン */}
          <button
            className="mail-work-list-btn"
            onClick={async (e) => {
              e.stopPropagation(); // 親のクリックを無効化

              await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                method: "DELETE",
              });

              onDelete();
            }}
          >
            <MdDelete size={25} />
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
