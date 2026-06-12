import { useState } from "react";
import { MdDelete } from "react-icons/md";

function TaskList({ tasks, onDelete }) {
  return (
    <div className="mail-work-list">
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          {task.content}
          <button
            className="mail-work-list-btn"
            onClick={async () => {
              await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                method: "DELETE",
              });
              onDelete(); // 再取得
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
