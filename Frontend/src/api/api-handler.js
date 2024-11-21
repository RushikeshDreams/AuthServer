import axios from 'axios';

export const postMethodCall = async (url, data, headers = {}, contentType = 'application/json') => {
  try {
    const apiResponse = await axios({
      method: 'post',
      url,
      data,
      headers: { 'Content-Type': contentType, ...headers },
    });
    return { status: true, data: apiResponse.data };
  } catch (error) {
    return { status: false, data: error.response?.data };
  }
};

export const getMethodCall = async (url) => {
  try {
    const apiResponse = await axios({ method: 'get', url });
    return { status: true, data: apiResponse.data };
  } catch (error) {
    return { status: false, data: error?.response?.data };
  }
};
