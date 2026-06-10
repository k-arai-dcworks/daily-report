import { useState } from "react";

// 入力内容を保持する状態（Reactのメモリ）
function WorkTextbox({ value, onChange }) {
  return (
    <textarea
      className="textbox-5"
      placeholder="業務内容を入力"
      value={value}
      onChange={onChange}
    />
  );
}

export default WorkTextbox;
