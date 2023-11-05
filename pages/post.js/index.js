import { InputText } from 'primereact/inputtext';
import { useState, useContext, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CascadeSelect } from 'primereact/cascadeselect';
import { InputNumber } from 'primereact/inputnumber';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { UserContext } from '@/utils/context/user';
import { CityContext } from '@/utils/context/city';
import cityData from '@/utils/service/citydata';

import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';
import { Button } from 'primereact/button';
import UploadImg from '@/app/components/UploadImg';

import axios from 'axios';

export default function Post() {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const { city, getCityName } = useContext(CityContext);
  const [roomData, setRoomData] = useState({ user: user, city: city.code });

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [number, setNumber] = useState(null);
  const [area, setArea] = useState(null);
  const [floor, setFloor] = useState(null);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(city);
  // For update original image array when it's a modify action
  const [existingImages, setExistingImages] = useState([]);

  const initializeRoom = parsedRoom => {
    // This is a editing operation
    setTitle(parsedRoom.title);
    setPrice(parsedRoom.price);
    setContact(parsedRoom.contact);
    setNumber(parsedRoom.number);
    setArea(parsedRoom.area);
    setFloor(parsedRoom.floor);
    setAddress(parsedRoom.address);
    setLocation(parsedRoom.location);
    setSelectedCity(getCityName(parsedRoom.city));

    setRoomData(parsedRoom);

    setExistingImages(parsedRoom.url);
  };

  const mode = router.query.mode;
  useEffect(() => {
    if (mode == 'edit') {
      const room = localStorage.getItem('roomData');
      localStorage.removeItem('roomData');
      const parsedRoom = JSON.parse(room);
      initializeRoom(parsedRoom);
    }
  }, []);

  const fileUploadRef = useRef(null);

  const toastMessage = useRef(null);

  const showToast = (message, type) => {
    toastMessage.current.show({
      severity: type,
      summary: type.charAt(0).toUpperCase() + type.slice(1),
      detail: message,
      life: 2000,
    });
  };
  // Get lat lng data from address input
  const setGeoPosition = async () => {
    if (address) {
      const ADDRESS_STRING = encodeURIComponent(
        address + ', ' + selectedCity + ', France',
      );
      const apiGeoAddress = `https://maps.googleapis.com/maps/api/geocode/json?address=${ADDRESS_STRING}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}`;

      try {
        const response = await fetch(apiGeoAddress);

        if (!response.ok) {
          throw new Error('Network Error');
        }

        const data = await response.json();

        if (data.status === 'OK' && data.results.length > 0) {
          setLocation({
            ...location,
            lat: data.results[0].geometry.location.lat,
            lng: data.results[0].geometry.location.lng,
          });

          setRoomData({
            ...roomData,
            location: {
              lat: data.results[0].geometry.location.lat,
              lng: data.results[0].geometry.location.lng,
            },
          });
          showToast('Valid Address', 'success');
        } else {
          showToast('Can not get loaction data, invalid address.', 'error');
          return;
        }
      } catch (error) {
        showToast('Error', 'error');
        return;
      }
    }
  };
  const onDeleteImg = (index, e) => {
    e.preventDefault();
    const updatedRoomImages = existingImages;
    updatedRoomImages.splice(index, 1);
    setRoomData({ ...roomData, url: updatedRoomImages });
  };
  // Submit to add a new room
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    // Set all images files' data to formData
    const fileList = fileUploadRef.current.getFiles();
    fileList.forEach(file => {
      formData.append('files', file);
    });
    if (!location) {
      showToast('Get room location failed', 'error');
      return;
    }

    formData.append('data', JSON.stringify(roomData));
    let res;
    // Send update room request
    if (mode == 'edit') {
      // const id = roomData.id;
      const url = [process.env.NEXT_PUBLIC_API_URL, 'room', 'edit'].join('/');
      res = await axios({
        method: 'PUT',
        url: url,
        data: formData,
      });
      // Send add room request
    } else {
      const url = [process.env.NEXT_PUBLIC_API_URL, 'room', 'add'].join('/');
      res = await axios({
        method: 'POST',
        url: url,
        data: formData,
      });
    }
    if (res.status === 200) {
      showToast('Data updated', 'success');
      setTimeout(() => {
        router.push({
          pathname: '/account',
        });
      }, 2000);
    } else {
      showToast('Data update failed', 'error');
      return;
    }
  };
  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={false} />
      <Toast ref={toastMessage} position="center" />

      <form className="postContainer" onSubmit={onSubmit}>
        <div className="flex align-self-center flex-column item1 ">
          <UploadImg fileUploadRef={fileUploadRef} />
          <div className="flex flex-wrap mt-4 relative">
            {mode == 'edit' ? (
              existingImages.length > 0 ? (
                existingImages.map((img, index) => {
                  return (
                    <div
                      key={index}
                      className="flex flex-nowrap items-center space-x-2 "
                    >
                      <Image
                        src={img}
                        alt={title}
                        width="160"
                        key={index}
                      ></Image>
                      <Button
                        icon="pi pi-times"
                        className="p-button-rounded"
                        onClick={e => onDeleteImg(index, e)}
                      ></Button>
                    </div>
                  );
                })
              ) : (
                <span className="text-3xl">No image yet</span>
              )
            ) : null}
          </div>
        </div>

        <div className="flex align-self-center flex-column gap-2 item2">
          <label htmlFor="city">City</label>
          <CascadeSelect
            id="city"
            required
            value={selectedCity}
            onChange={e => {
              setSelectedCity(e.value.cname);
              setRoomData({ ...roomData, city: e.value.code });
            }}
            options={cityData}
            optionLabel="cname"
            optionGroupLabel="name"
            optionGroupChildren={['departement', 'cities']}
            breakpoint="767px"
            placeholder="Select a City"
            style={{ width: '10rem' }}
          />
          <label htmlFor="title">Title</label>
          <InputText
            style={{ width: '100%' }}
            id="title"
            placeholder="Title"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setRoomData({ ...roomData, title: e.target.value });
            }}
          />
          <div className="flex flex-column gap-2">
            <label htmlFor="price">Price</label>
            <InputNumber
              style={{ width: '10rem' }}
              required
              value={price}
              placeholder="Price"
              tooltipOptions={{ position: 'bottom' }}
              tooltip="Please enter a positive integer"
              onValueChange={e => {
                setPrice(e.value);
                setRoomData({ ...roomData, price: e.value });
              }}
              mode="currency"
              currency="EUR"
              locale="fr-FR"
              min={0}
              max={10000}
            />
          </div>
          <div className=" flex flex-column gap-2">
            <label htmlFor="number">Number of rooms</label>
            <InputNumber
              style={{ width: '10rem' }}
              required
              id="number"
              placeholder="Number of rooms"
              tooltipOptions={{ position: 'bottom' }}
              tooltip="Please enter a positive integer"
              value={number}
              onValueChange={e => {
                setNumber(e.value);
                setRoomData({ ...roomData, number: e.value });
              }}
              min={0}
              max={100}
            />
          </div>
          <div className=" flex flex-column  gap-2">
            <label htmlFor="area">Area</label>
            <InputNumber
              style={{ width: '10rem' }}
              required
              id="area"
              suffix=" m²"
              placeholder="Area"
              tooltipOptions={{ position: 'bottom' }}
              tooltip="Please enter a positive integer"
              value={area}
              onValueChange={e => {
                setArea(e.value);
                setRoomData({ ...roomData, area: e.value });
              }}
              min={0}
              max={10000}
            />
          </div>
          <div className=" flex flex-column gap-2">
            <label htmlFor="floor">Floor</label>
            <InputNumber
              style={{ width: '10rem' }}
              required
              id="floor"
              placeholder="Floor"
              tooltipOptions={{ position: 'bottom' }}
              tooltip="Please enter a positive integer"
              value={floor}
              onValueChange={e => {
                setFloor(e.value);
                setRoomData({ ...roomData, floor: e.value });
              }}
              min={0}
              max={10000}
            />
          </div>

          <label htmlFor="address">
            Address{' '}
            <span>
              {location
                ? `Latitude and longitude: ${location.lat}+${location.lng}`
                : null}
            </span>
          </label>
          <InputText
            style={{ width: '100%' }}
            required
            id="address"
            placeholder="Address"
            value={address}
            onChange={e => {
              setAddress(e.target.value);
              setRoomData({ ...roomData, address: e.target.value });
            }}
            onBlur={() => setGeoPosition()}
          />
          <label htmlFor="contact">Contact</label>
          <InputText
            style={{ width: '100%' }}
            required
            id="contact"
            placeholder="Contact information"
            value={contact}
            onChange={e => {
              setContact(e.target.value);
              setRoomData({ ...roomData, contact: e.target.value });
            }}
          />

          <Button className="w-6rem" type="submit">
            Submit
          </Button>
        </div>
      </form>

      <Footer />
    </div>
  );
}
