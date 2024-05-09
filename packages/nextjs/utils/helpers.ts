export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  const isoString = date.toISOString();
  return isoString.split("T")[0];
};
