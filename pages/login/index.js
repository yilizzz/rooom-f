import { UserContext } from '@/utils/context/user';
import React, { useState, useContext, useRef } from 'react';
import { useRouter } from 'next/router';
import Nav from '@/app/components/Nav';
import Footer from '@/app/components/Footer';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';

function LoginPage() {
  const { login } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const toastMessage = useRef(null);
  const showToast = (message, type) => {
    if (toastMessage.current) {
      toastMessage.current.show({
        severity: type,
        summary: type.charAt(0).toUpperCase() + type.slice(1),
        detail: message,
        life: 2000,
      });
    }
  };
  const router = useRouter();
  const handleLogin = async () => {
    if (username != '' && password != '') {
      const res = await login({ username: username, password: password });
      if (res) {
        router.push({
          pathname: '/account',
        });
      } else {
        showToast('Login error.', 'error');
      }
    } else {
      showToast('Need a username.', 'error');
    }
  };

  return (
    <div className="flex flex-column justify-content-center align-items-center h-screen w-screen relative">
      <Nav selectFlag={false} />
      <Toast ref={toastMessage} position="center" />
      <div className=" flex flex-column align-self-center justify-content-evenly h-20rem w-30rem">
        <h2 className="text-blue-900">LOG IN</h2>
        <InputText
          placeholder="a"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <InputText
          placeholder="a"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <Button
          className="w-8rem flex align-self-end bg-blue-900"
          label="Login"
          icon="pi pi-external-link"
          onClick={() => handleLogin()}
        />
      </div>
      <Footer />
    </div>
  );
}
export default LoginPage;
