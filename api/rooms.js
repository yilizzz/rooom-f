import axios from 'axios';
const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Get data on all rental properties
export const getAllRooms = async () => {
  const url = [API_URL, 'room', 'all'].join('/');
  try {
    const res = await axios({
      method: 'GET',
      url: url,
    });
    return res.data;
    // const res = await fetch(baseUrl + 'rooms');
    // const data = await res.json();
    // return data;
  } catch (err) {
    throw err;
  }
};
// Get data on the latest 20 rental properties
export const getLatest = async () => {
  const url = [API_URL, 'room', 'last20'].join('/');
  try {
    const res = await axios({
      method: 'GET',
      url: url,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};
// Get data on one city's rental properties
export const getCityRooms = async cityCode => {
  const url = [API_URL, 'room', cityCode].join('/');

  const response = await axios.get(url);
  if (response.status === 200) {
    return response.data;
  }
  // This city has no room data or network errors
  return [];
};
// Get posted rooms of certain user
export const getPostRooms = async user => {
  const url = [API_URL, 'room', 'postlist', user].join('/');

  const response = await axios.get(url);

  if (response.status === 200) {
    return response.data;
  }
  // This users has not posted room yet
  return [];
};
// Get marked rooms of certain user
export const getMarkedRooms = async user => {
  const url = [API_URL, 'room', 'marklist', user].join('/');

  const response = await axios.get(url);

  if (response.status === 200) {
    return response.data;
  }
  console.log(response.data.error);
  return [];
};
export const deleteMark = async (user, id) => {
  const url = [API_URL, 'room', 'deletemark'].join('/');

  const response = await axios({
    method: 'DELETE',
    url: url,
    data: {
      user,
      id,
    },
  });
  if (response.status === 200) {
    console.log('One room unmarked.');
    return true;
  }
  console.log(response.data.error);
  return false;
};
export const deletePost = async (user, id) => {
  const url = [API_URL, 'room', 'deletepost'].join('/');

  const response = await axios({
    method: 'DELETE',
    url: url,
    data: {
      user,
      id,
    },
  });
  if (response.status === 200) {
    console.log('One room deleted.');
    return true;
  }
  console.log(response.data.error);
  return false;
};
// Add a rental room announce
// export const AddRoom = async (files, user) => {
//   const url = [API_URL, 'room', 'add'].join('/');
//   const response = await axios({
//     method: 'POST',
//     url: url,
//     data: {
//       files,
//       user,
//     },
//   });
//   if (response.status === 200) {
//     console.log('Add a room successful');
//     return 200;
//   }
// };
// Mark a room for a certain user
export const markRoom = async (user, id) => {
  const url = [API_URL, 'room', 'mark'].join('/');

  const response = await axios({
    method: 'POST',
    url: url,
    data: {
      user,
      id,
    },
  });
  if (response.status === 200) {
    console.log('Mark a room successful');
    return 200;
  }
  if (response.status === 205) {
    console.log('Marked this room already');
    return 205;
  }
  // No such user or network errors
  return false;
};
