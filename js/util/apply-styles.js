export default (elem, styles) => {
  for (const i in styles) {
    if (styles[i]) {
      elem.style[i] = styles[i];
    }
  }
};
