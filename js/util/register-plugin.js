const plugins = '__FOUNDATION_PLUGINS__';

export default plugin => {
  if (typeof window[plugins] === 'undefined') {
    window[plugins] = new Set();
  }

  window[plugins].add(plugin);
}
