import { InputText } from 'primereact/inputtext';
import { useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import { CascadeSelect } from 'primereact/cascadeselect';
import { InputNumber } from 'primereact/inputnumber';
import Nav from '@/app/components/Nav';
import { UserContext } from '@/utils/context/user';
import { CityContext } from '@/utils/context/city';
import cityData from '@/utils/service/citydata';

import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';

import { z } from 'zod';

export default function Post() {
  const schema = z.object({
    user: z.string().min(1, 'Need a valid user'),
    city: z.string().min(1, 'Need a valid city'),
  });
  const router = useRouter();
  const { user } = useContext(UserContext);
  const { city } = useContext(CityContext);
  const [roomData, setRoomData] = useState({ city: city.code });

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [contact, setContact] = useState('');
  const [number, setNumber] = useState(null);
  const [area, setArea] = useState(null);
  const [floor, setFloor] = useState(null);

  const [address, setAddress] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedCity, setSelectedCity] = useState(city);

  // Get lat lng data from address input
  const setGeoPosition = async () => {
    if (address) {
      const ADDRESS_STRING = encodeURIComponent(address);
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

          console.log(data.results[0].geometry.location);
          alert('valid address');
        } else {
          alert('Can not get loaction data, invalid address.');
          return;
        }
      } catch (error) {
        console.error('Error:', error);
        return;
      }
    }
  };
  //--- Primereact Upload Component configuration start

  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);

  const onTemplateSelect = e => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach(key => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = options => {
    const { className, chooseButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : '0 B';

    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}

        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: '10rem', height: '12px' }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: '5em',
            borderRadius: '50%',
            backgroundColor: 'var(--surface-b)',
            color: 'var(--surface-d)',
          }}
        ></i>
        <span
          style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: 'pi pi-fw pi-images',
    iconOnly: true,
    className: 'custom-choose-btn p-button-rounded p-button-outlined',
  };

  const cancelOptions = {
    icon: 'pi pi-fw pi-times',
    iconOnly: true,
    className:
      'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined',
  };
  //--- Primereact Upload Component configuration end

  // Submit to add a new room
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();

    // Set all images files' data to formData
    const fileList = fileUploadRef.current.getFiles();
    fileList.forEach(file => {
      formData.append('files', file);
    });

    // Set username to formData
    const updatedRoomData = {
      ...roomData,
      user: user,
    };
    setRoomData(updatedRoomData);

    // Validation to roomData
    const result = schema.safeParse(roomData);
    if (!result.success) {
      alert('Validation error.');

      return;
    }

    formData.append('data', JSON.stringify(roomData));
    console.log(roomData);
    // Send add room request
    const url = [process.env.NEXT_PUBLIC_API_URL, 'room', 'add'].join('/');
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (res.status === 200) {
      alert('add a room');

      router.push({
        pathname: '/account',
      });
    } else {
      alert(res.json());
    }
  };
  return (
    <>
      <div className="flex flex-column gap-2 p-4">
        <Nav selectFlag={false} />
        <form onSubmit={onSubmit}>
          <label htmlFor="title">Title</label>
          <InputText
            id="title"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setRoomData({ ...roomData, title: e.target.value });
            }}
          />
          <p>{roomData.city}</p>
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
          <label htmlFor="price">Price</label>
          <InputNumber
            value={price}
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
          <label htmlFor="number">Number of rooms</label>

          <InputNumber
            required
            id="number"
            value={number}
            onValueChange={e => {
              setNumber(e.value);
              setRoomData({ ...roomData, number: e.value });
            }}
            min={0}
            max={100}
          />
          <label htmlFor="area">Area</label>

          <InputNumber
            required
            id="area"
            suffix=" m²"
            value={area}
            onValueChange={e => {
              setArea(e.value);
              setRoomData({ ...roomData, area: e.value });
            }}
            min={0}
            max={10000}
          />
          <label htmlFor="floor">Floor</label>

          <InputNumber
            required
            id="floor"
            value={floor}
            onValueChange={e => {
              setFloor(e.value);
              setRoomData({ ...roomData, floor: e.value });
            }}
            min={0}
            max={10000}
          />
          <div>
            <Toast ref={toast}></Toast>

            <Tooltip
              target=".custom-choose-btn"
              content="Choose"
              position="bottom"
            />

            <Tooltip
              target=".custom-cancel-btn"
              content="Clear"
              position="bottom"
            />

            <FileUpload
              ref={fileUploadRef}
              name="files"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              onSelect={onTemplateSelect}
              onError={onTemplateClear}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
              itemTemplate={itemTemplate}
              emptyTemplate={emptyTemplate}
              chooseOptions={chooseOptions}
              cancelOptions={cancelOptions}
            />
          </div>
          <label htmlFor="address">Address</label>
          <InputText
            required
            id="address"
            value={address}
            onChange={e => {
              setAddress(e.target.value);
              setRoomData({ ...roomData, address: e.target.value });
            }}
            onBlur={() => setGeoPosition()}
          />
          <label htmlFor="contact">Contact</label>
          <InputText
            required
            id="contact"
            value={contact}
            onChange={e => {
              setContact(e.target.value);
              setRoomData({ ...roomData, contact: e.target.value });
            }}
          />
          <p>{location ? `${location.lat}+${location.lng} ` : 'location'}</p>
          <p>{user ? user : 'user'}</p>
          {/*<p>{selectedCity?.code}</p>
          <p>{address}</p> */}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
