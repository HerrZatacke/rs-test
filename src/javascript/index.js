import { debounce } from 'debounce';
import '../scss/index.scss';
import getRemoteStorage from './tools/remotestorage';
import createRawImage from './tools/createRawImage';
import save from './tools/storage';
import createImage from './tools/createImage';
import renderList from './renderList';

document.addEventListener('DOMContentLoaded', () => {
  const rs = getRemoteStorage();
  window.rs = rs;

  const { gbPrinterWeb } = rs;

  const buttonAdd1 = document.getElementById('add-1');
  const buttonAdd10 = document.getElementById('add-10');
  const buttonAdd100 = document.getElementById('add-100');
  const buttonDelete = document.getElementById('delete-all');
  const buttonFlush = document.getElementById('flush');
  let globalIndex = 1;

  gbPrinterWeb.onImagesUpdated(debounce((event) => {
    console.log(event);
    renderList(gbPrinterWeb, 'after update event');
  }, 200, false));

  gbPrinterWeb.getImages()
    .then((images) => {
      globalIndex = Math.max(globalIndex, ...images.map(({ index }) => index));
    });

  renderList(gbPrinterWeb, 'initial');

  const add = (amount) => (
    new Promise(((resolve) => {
      const raws = [...Array(amount)].map(createRawImage);

      const addNext = () => {
        const nextRawImage = raws.pop();
        if (!nextRawImage) {
          resolve();
          return;
        }

        save(nextRawImage)
          .then((hash) => (
            createImage(hash, globalIndex)
          ))
          .then((image) => {
            gbPrinterWeb.putImage(image);
          })
          .then(() => {
            globalIndex += 1;

            window.setTimeout(() => {
              addNext();
            }, 50);
          });
      };

      addNext();
    }))
  );

  const cleanupRawData = () => (
    gbPrinterWeb.getImages()
      .then((images) => (
        images.map(({ hash }) => hash).filter(Boolean)
      ))
      .then((imageHashes) => (
        gbPrinterWeb.getRawImageHashes()
          .then((rawImageHashes) => (
            rawImageHashes.filter((rawImageHash) => (
              !imageHashes.includes(rawImageHash)
            ))
          ))
          .then((rawToDelete) => {
            gbPrinterWeb.deleteRawImages(rawToDelete);
          })
      ))
  );

  buttonAdd1.addEventListener('click', () => {
    add(1)
      .then(() => renderList(gbPrinterWeb, 'after add 1'));
  });

  buttonAdd10.addEventListener('click', () => {
    add(10)
      .then(() => renderList(gbPrinterWeb, 'after add 10'));
  });

  buttonAdd100.addEventListener('click', () => {
    add(100)
      .then(() => renderList(gbPrinterWeb, 'after add 100'));
  });

  buttonFlush.addEventListener('click', () => {
    rs.local.flush('/');
  });

  buttonDelete.addEventListener('click', () => {
    gbPrinterWeb.getImages()
      .then((images) => (
        images.map(({ hash }) => hash).filter(Boolean)
      ))
      .then((hashes) => {
        gbPrinterWeb
          .deleteImages(hashes)
          .then(cleanupRawData)
          .then(() => renderList(gbPrinterWeb, 'after cleanup'));
      });
  });
});
