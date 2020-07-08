const GbPrinterWeb = {
  name: 'gb-printer-web',
  builder: (client) => {
    client.declareType('image', {
      type: 'object',
      properties: {
        hash: { type: 'string' },
        hashes: {
          type: 'object',
          properties: {
            r: { type: 'string' },
            g: { type: 'string' },
            b: { type: 'string' },
            n: { type: 'string' },
          },
          required: [],
        },
        timestamp: { type: 'number' },
        index: { type: 'number' },
        palette: { type: ['string', 'object'] },
        tags: { type: 'array' },
        title: { type: 'string' },
        lockFrame: { type: 'boolean' },
      },
      required: ['hash', 'timestamp', 'index', 'palette'],
    });

    client.declareType('rawImage', {
      type: 'array',
    });

    return {
      exports: {
        onImagesUpdated: (callback) => {
          client.on('change', (event) => {
            callback(event);
          });
        },

        putRawImage: (rawImage, hash) => {
          console.log('putRawImage');
          return (
            client.storeObject('rawImage', `rawImages/${hash}`, rawImage)
          );
        },

        getRawImage: (hash) => {
          console.log('getRawImage');
          return (
            client.getObject(`rawImages/${hash}`)
          );
        },


        deleteRawImage: (hash) => {
          console.log('deleteRawImage');
          return (
            client.remove(`rawImages/${hash}`)
          );
        },

        putImage: (image) => {
          console.log('putImage');
          return (
            client.storeObject('image', `images/${image.hash}`, image)
          );
        },

        deleteImage: (hash) => {
          console.log('deleteImage');
          return (
            client.remove(`images/${hash}`)
          );
        },

        deleteImages(hashes) {
          return Promise.all(hashes.map(this.deleteImage));
        },

        deleteRawImages(hashes) {
          return Promise.all(hashes.map(this.deleteRawImage));
        },

        getRawImageHashes: () => (
          client.getAll('rawImages/')
            .then((images) => (
              Object.keys(images)
            ))
        ),

        getImages: () => (
          client.getAll('images/')
            .then((images) => (
              Object.values(images)
            ))
        ),
      },
    };
  },
};

export default GbPrinterWeb;
