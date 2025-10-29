const getStringForApi = (data: string) =>
  data.toLowerCase().replaceAll(" ", "_");

const capitalize = (str: string | undefined): string => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const cleanPhoneNumber = (phoneNumber: string | undefined): string => {
  if (!phoneNumber) return "";
  return phoneNumber.replace(/[\s+\-()]/g, "");
};

export { getStringForApi, capitalize, cleanPhoneNumber };
