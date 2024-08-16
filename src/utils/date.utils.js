module.exports = {
  parseDate: (strDate) => {
    const [year, month, day] = strDate.split("-");
    const date = new Date(+year, month - 1, +day);
    return date;
  },
};
