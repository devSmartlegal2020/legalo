const myPlugin = () => ({
  name: 'custom-build-check',
  buildStart() {
    console.log('Build started...');
  },
  buildEnd() {
    console.log('Build ended...');
  }
});