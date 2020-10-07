const up = (item) => {
  return {
    ...item,
    status: 'Active',
  };
}

const down = (item) => {
  const { status, ...rest } = item;
  return rest;
}

module.exports = {
  up,
  down,
  sequence: 1,
};
