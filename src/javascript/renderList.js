const imageList = document.getElementById('images');
const counter = document.getElementById('counter');

const df = (timestamp) => {
  const d = new Date(timestamp);
  return `${
    d.getDate().toString(10).padStart(2, '0')
  }-${
    (d.getMonth() + 1).toString(10).padStart(2, '0')
  }-${
    d.getFullYear()
  } ${
    d.getHours().toString(10).padStart(2, '0')
  }:${
    d.getMinutes().toString(10).padStart(2, '0')
  }:${
    d.getSeconds().toString(10).padStart(2, '0')
  }:${
    d.getMilliseconds().toString(10).padStart(3, '0')
  }`;
};

const renderList = (gbPrinterWeb, calledFrom) => {
  imageList.innerHTML = '';
  counter.innerHTML = '';

  console.log('renderList', calledFrom);

  gbPrinterWeb.getImages()
    .then((images) => (
      Promise.all(
        images.map((image) => {
          if (typeof image === 'boolean') {
            // sometimes the image is just "true" or "false" ???
            return Promise.resolve(image);
          }

          return (
            gbPrinterWeb.getRawImage(image.hash)
              .then((rawImageData = []) => ({
                ...image,
                rawImageData,
              }))
          );
        }),
      )
    ))
    .then((images) => {

      let validImagesCounter = 0;
      images.forEach((image) => {
        const li = document.createElement('li');

        if (typeof image === 'boolean') {
          li.innerText = image ? 'true' : 'false';
        } else {
          validImagesCounter += 1;
          li.innerText = `${image.title} - ${image.hash} - (${image.rawImageData.length}) - ${df(image.timestamp)}`;

          const buttonDel = document.createElement('button');
          buttonDel.innerText = 'delete';
          buttonDel.addEventListener('click', () => {
            gbPrinterWeb.deleteImage(image.hash)
              .then(() => (
                gbPrinterWeb.deleteRawImage(image.hash)
              ))
              .then(() => {
                renderList(gbPrinterWeb, 'after del');
              });
          });

          li.appendChild(buttonDel);
        }

        imageList.appendChild(li);
      });

      counter.innerText = `${images.length} images with ${validImagesCounter} being valid`;
    });
};

export default renderList;
