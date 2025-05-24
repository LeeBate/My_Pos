export const getApiUrl = (path: string) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  console.log("`${baseUrl}${path}`", `${baseUrl}${path}`);
  return `${baseUrl}${path}`;
};
