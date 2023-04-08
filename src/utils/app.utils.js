export default function showLoadingMessage(msgRef, index, interval) {
  const message =
    'Due to this application hosting plan being free, the first time we make a request will take a little longer. Please be patient and wait for the connection with our servers to be established =)';

  if (index < message.length) {
    msgRef.current.innerHTML += message[index++];
    setTimeout(() => {
      showLoadingMessage(msgRef, index, interval);
    }, interval);
  }
}
