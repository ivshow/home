import http from './http';

export const login = async () => {
  const token = sessionStorage.getItem('token');
  if (!token) {
    const result = await http.post('/appLogin?userPhone=13319109705&password=123456');
    sessionStorage.setItem('token', result);
  }
};

export const getUserInfo = params => http.get('/getUserInfoByUserId', params);

export const getUserLiterature = params => http.get('/getUserLiterature', params);

export const getLiterature = params => http.get('/getLiterature', params);

export const getCommentList = params => http.get('/getCommentList', params);
