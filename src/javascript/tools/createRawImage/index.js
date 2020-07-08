const ztf = () => (
  Math.floor(Math.random() * 16).toString(16)
);

const createRawImage = () => (
  [...Array(360)].map(() => (
    [...Array(16)].map(() => (
      `${ztf()}${ztf()}`
    )).join(' ')
  ))
);

export default createRawImage;
