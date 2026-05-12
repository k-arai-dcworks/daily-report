// ログイン確認
export const checkLogin = async () => {
  try {
    const res = await fetch("http://localhost:8080/mail/me", {
      method: "GET",
      credentials: "include",
    });

    return res.ok;
  } catch {
    return false;
  }
};

// メール送信
export const sendMail = async (text) => {
  const res = await fetch("http://localhost:8080/mail/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ text }),
  });

  return res.text();
};