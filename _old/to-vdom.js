function tovdom(elems, h) {
  return _.map(elems, elem => {
    if (elem.nodeType === Node.TEXT_NODE) {
      return elem.textContent;
    }
    else {
      return h(elem.nodeName.toLowerCase(), getAttrs(elem.attributes), tovdom(elem.childNodes, h));
    }
  });
}

function getAttrs(attrs) {
  const obj = {};

  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    obj[attr.nodeName] = attr.nodeValue;
  }

  return obj;
}
