import { getLatest } from '@/api/rooms';
import React from 'react';
import Nav from '@/app/components/Nav';
import Circular from '@/app/components/Circular';
import Footer from '@/app/components/Footer';

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
      <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
        <Nav selectFlag={true}></Nav>
        <Circular rooms={rooms} />
        <Footer />
      </div>
    </>
  );
}

export default Page;
