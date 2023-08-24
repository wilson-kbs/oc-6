function join(...paths) {
  return paths.join('/').replace(/\/{2,}/g, '/');
}

export { join }
