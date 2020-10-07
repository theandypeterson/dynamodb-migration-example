const up = (item) => {
  const { status, ...rest } = item;
  return {
    ...rest,
    Status: status,
  };
}

const down = (item) => {
  const { Status, ...rest } = item;
  return {
    ...rest,
    status: Status,
  };
}

module.exports = {
  up,
  down,
  sequence: 2,
};