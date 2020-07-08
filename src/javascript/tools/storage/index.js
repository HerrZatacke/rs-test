import hash from 'object-hash';
import getRemoteStorage from '../remotestorage';

const remoteStorage = getRemoteStorage();

const save = (lineBuffer) => {
  const imageData = lineBuffer
    .map((line) => (
      line.replace(/ /gi, '')
    ));

  const dataHash = hash(imageData);
  return remoteStorage.gbPrinterWeb.putRawImage(imageData, dataHash)
    .then(() => dataHash);
};

const del = (dataHash) => (
  remoteStorage.gbPrinterWeb.deleteRawImage(dataHash)
);

export {
  save,
  del,
};
