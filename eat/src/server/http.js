import axios from 'axios';
import { stringify } from 'qs';
import { Toast } from 'vant';

const BASE_URL = '/app';

const error = (res, reject) => {
  reject(res);
  Toast.fail(res);
};

const success = ({ status, data }, resolve, reject) => {
  if (status != 200) {
    return reject();
  }

  const { code, message, result } = data;
  if (code != 0) {
    Toast.fail(message);
    return reject(message);
  }

  resolve(result);
};

const http = (method, url, params) =>
  new Promise((resolve, reject) => {
    axios({
      method: method,
      url: BASE_URL + url,
      data: params,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        token: sessionStorage.getItem('token')
      },
      timeout: 10000
    })
      .then(res => success(res, resolve, reject))
      .catch(err => error(err, reject));
  });

const get = (url, params) => http('get', params ? url + '?' + stringify(params) : url);
const post = (url, params) => http('post', url, params);

export default {
  get,
  post
};
