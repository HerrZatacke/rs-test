import RemoteStorage from 'remotestoragejs';
import Widget from 'remotestorage-widget';
import Module from './module';

let remoteStorage;

const getRemoteStorage = () => {

  if (remoteStorage) {
    return remoteStorage;
  }

  remoteStorage = new RemoteStorage({
    cache: true,
    changeEvents: {
      local: false,
      window: false,
      remote: true,
      conflict: true,
    },
    modules: [Module],
    // logging: true,
  });

  remoteStorage.access.claim('gb-printer-web', 'rw');
  const rsWidget = new Widget(remoteStorage, {
    leaveOpen: true,
  });
  rsWidget.attach();

  window.rs = remoteStorage;

  return remoteStorage;
};

export default getRemoteStorage;
