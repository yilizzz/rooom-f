import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const logIn = async userData => {
  const response = await axios({
    method: 'POST',
    url: `${API_URL}/login`,
    data: userData,
  });
  // A user login
  if (response.status === 200) {
    return 200;
  }
  // A new user, in this demo there is no registration for convenience
  if (response.status === 201) {
    return 201;
  }
  return false;
};

export const logOut = async () => {
  const response = await axios({
    method: 'POST',
    url: `${API_URL}/logout`,
  });

  if (response.status === 200) {
    return true;
  }
  return false;
};
