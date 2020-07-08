const createImage = (hash, index) => ({
  hash,
  timestamp: (new Date()).getTime(),
  title: 'Dummy image',
  index,
  tags: [],
  palette: 'bw',
});

export default createImage;
