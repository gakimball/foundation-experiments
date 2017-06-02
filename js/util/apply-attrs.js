export default (elem, attrs) => {
  for (const i in attrs) {
    elem.setAttribute(i, attrs[i]);
  }
};
