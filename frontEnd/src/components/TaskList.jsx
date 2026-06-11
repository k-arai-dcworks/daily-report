import { useState } from "react";

function TaskList({ tasks, onDelete }) {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>
          {task.content}
          <button
            onClick={async () => {
              await fetch(`http://localhost:8080/api/tasks/${task.id}`, {
                method: "DELETE",
              });
              onDelete(); // 再取得
            }}
          >
            削除
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskList;
