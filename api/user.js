const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const logIn = async userData => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    return 200;
  }
  if (response.status === 201) {
    return 201;
  }
  return false;
};

export const logOut = async () => {
  // Logic to clear user information on logout
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 200) {
    return true;
  }
  return false;
};
