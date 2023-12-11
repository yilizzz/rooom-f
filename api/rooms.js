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
  } catch (err) {
    throw err;
  }
};
// Get data on the latest 12 rental properties
export const getLatest = async () => {
  const url = [API_URL, 'room', 'last12'].join('/');
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
  try {
    const response = await axios.get(url);
    if (response.status === 200) {
      return response.data;
    } else {
      // This city has no room data
      return [];
    }
  } catch (error) {
    //server or network errors
    console.log(error);
    return false;
  }
};

// Get posted rooms of certain user
export const getPostRooms = async user => {
  const listName = 'post-list';
  const url = `${API_URL}/room/list?user=${user}&listName=${listName}`;

  try {
    const response = await axios.get(url);
    if (response.status == 404) {
      console.log('Data file error');
      return [];
    }
    if (response.status == 500) {
      console.log('Server error');
      return [];
    }
    return response.data;
  } catch (error) {
    //server or network errors
    console.log(error);
    return [];
  }
};
// Get marked rooms of certain user
export const getMarkedRooms = async user => {
  const listName = 'mark-list';
  const url = `${API_URL}/room/list?user=${user}&listName=${listName}`;
  try {
    const response = await axios.get(url);
    if (response.status == 404) {
      console.log('Data file error');
      return [];
    }
    if (response.status == 500) {
      console.log('Server error');
      return [];
    }
    return response.data;
  } catch (error) {
    //server or network errors
    console.log(error);
    return [];
  }
};
// Private function: Delete a record from mark-list or post-list
const deleteRoom = async (user, id, type) => {
  const url = [API_URL, 'room', type].join('/');
  try {
    const response = await axios({
      method: 'DELETE',
      url: url,
      data: {
        user: user,
        id: id,
      },
    });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    //server or network errors
    console.log(error);
    return false;
  }
};
// Delete a record from mark-list
export const deleteMark = async (user, id) => {
  const deleted = await deleteRoom(user, id, 'deletemark');

  return deleted;
};
// Delete a record from post-list
export const deletePost = async (user, id) => {
  const deleted = await deleteRoom(user, id, 'deletepost');
  return deleted;
};

// Mark a room for a certain user
export const markRoom = async (user, id) => {
  const url = [API_URL, 'room', 'mark'].join('/');
  try {
    const response = await axios({
      method: 'POST',
      url: url,
      data: {
        user: user,
        id: id,
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
    console.log(response.data);
    return false;
  } catch (error) {
    //server or network errors
    console.log(error);
    return false;
  }
};
// Add or Edit a room
export const updateRoom = async (formData, type) => {
  if (type === 'edit') {
    const url = [process.env.NEXT_PUBLIC_API_URL, 'room', 'edit'].join('/');
    try {
      const res = await axios.put(url, formData);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  if (type === 'add') {
    const url = [process.env.NEXT_PUBLIC_API_URL, 'room', 'add'].join('/');
    try {
      const res = await axios.post(url, formData);
      return res;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
};
