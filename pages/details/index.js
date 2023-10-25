import { useRouter } from 'next/router';
import Nav from '@/app/components/Nav';
import { Galleria } from 'primereact/galleria';
import { UserContext } from '@/utils/context/user';
import { useContext } from 'react';
import Link from 'next/link';
import { Button } from 'primereact/button';
import { markRoom } from '@/api/rooms';

export default function Details() {
  const { user } = useContext(UserContext);
  const router = useRouter();
  const { room } = router.query; // 如果不用解构赋值，const room = router.query.room;
  const parsedRoom = JSON.parse(room); // 使用 JSON.parse 解析数据
  // console.log('detail');
  // console.log(parsedRoom);// object data
  // console.log(room);//string data

  // Convert data format to use primereact Galleria
  const images = parsedRoom.url.map((url, index) => ({
    itemImageSrc: url,
    alt: room.title,
  }));

  const itemTemplate = item => {
    return (
      <img
        src={item.itemImageSrc}
        alt={item.alt}
        style={{ width: '100%', display: 'block' }}
      />
    );
  };
  const onMarkRoom = async (user, id) => {
    const res = await markRoom(user, id);
    if (res) {
      if (res === 200) alert('mark a room');
      else alert('marked already');
    } else {
      alert('failed');
    }
  };
  return (
    <>
      <Nav selectFlag={false} />
      <h1>{parsedRoom.title}</h1>
      <div>
        {user ? (
          <Button
            severity="info"
            onClick={() => onMarkRoom(user, parsedRoom.id)}
          >
            Mark
          </Button>
        ) : (
          <Link href="/account">Login to mark</Link>
        )}
      </div>
      <div className="card">
        <Galleria
          value={images}
          style={{ maxWidth: '640px' }}
          showThumbnails={false}
          showIndicators
          changeItemOnIndicatorHover
          item={itemTemplate}
        />
      </div>
    </>
  );
}
