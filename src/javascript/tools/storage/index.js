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

export default save;
