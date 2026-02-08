import axios from 'axios';

const API_BASE = "http://221.142.148.73:8000";

const registerUser = async (userInfo) => {
  try {
    const res = await axios.post(`${API_BASE}/api/auth/register`, userInfo, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return res.data;
  } catch (error) {
    // 에러 응답 받기
    if (error.response) {
      return {
        success: false,
        status: error.response.status,
        message: error.response.data.detail || "알 수 없는 오류"
      };
    } else {
      return {
        success: false,
        message: "서버에 연결할 수 없습니다."
      };
    }
  }
};

