const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiVersion = "/api/v1";

// 서버 에러 응답({ resultCode, msg })은 "resultCode : msg" 형식으로 알림
// 서버 연결 실패처럼 resultCode가 없는 에러는 에러 메시지를 그대로 알림
export const alertError = (error: {
  resultCode?: string;
  msg?: string;
  message?: string;
}) => {
  if (error.resultCode == null) {
    alert(error.message ?? "알 수 없는 오류가 발생했습니다.");
    return;
  }

  alert(`${error.resultCode} : ${error.msg}`);
};

export const apiFetch = (url: string, options?: RequestInit) => {
  if (options?.body) {
    const headers = new Headers(options?.headers || {});
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json; charset=utf-8");
    }

    options.headers = headers;
  }

  return fetch(`${NEXT_PUBLIC_API_BASE_URL}${apiVersion}${url}`, options).then(
    (res) => {
      if (!res.ok) {
        return res.json().then((errorData) => {
          throw errorData;
        });
      }

      return res.json();
    },
  );
};
