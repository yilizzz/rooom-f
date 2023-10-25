import Link from 'next/link';
import { getAllRooms, getLatest } from '@/api/rooms';
import React, { useState, useContext } from 'react';
import { CascadeSelect } from 'primereact/cascadeselect';
import { CityContext } from '@/utils/context/city';
import Nav from '@/app/components/Nav';

export async function getServerSideProps() {
  try {
    // const data = await getAllRooms();
    const data = await getLatest();
    return {
      props: {
        rooms: data, // Ensure it's JSON data here
      },
    };
  } catch (error) {
    return {
      props: {
        rooms: [],
      },
    };
  }
}

function Page({ rooms }) {
  return (
    <>
      <div>
        <Nav selectFlag={true}></Nav>

        <h2>Rooms</h2>
        <ul>
          {rooms &&
            rooms.map((room, index) => (
              <li key={index}>
                {room.url[0] ? (
                  <img src={room.url[0]} alt={room.title} />
                ) : null}
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default Page;
