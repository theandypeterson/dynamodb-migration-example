const up = (item) => {
  return {
    ...item,
    defaultSelection: ['Apple'],
  };
}

const down = (item) => {
  const { defaultSelection, ...rest } = item;
  return rest;
}

module.exports = {
  up,
  down,
  sequence: 3,
};