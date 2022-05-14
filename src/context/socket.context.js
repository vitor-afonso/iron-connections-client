//jshint esversion:9

import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './auth.context';
import socketIOClient from 'socket.io-client';

const SocketIoContext = React.createContext();

function SocketIoProviderWrapper(props) {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      setSocket(socketIOClient(process.env.REACT_APP_PROJECT_API));
    }
  }, [user]);

  return (
    <SocketIoContext.Provider
      value={{
        socket,
      }}
    >
      {props.children}
    </SocketIoContext.Provider>
  );
}

export { SocketIoProviderWrapper, SocketIoContext };
