// This API assumes only JSON endpoints
import he from "he";

const baseUrl = "http://www.mocky.io";
const productGroups = "/v2/5e7793be330000c24409a020";
const productGroupsUrl = new URL(productGroups, baseUrl);

type ResponseBody<T> = {
  data: T;
};

interface StringListResponse extends ResponseBody<string[]> {}

const get = async <T>(url: string): Promise<T> => {
  const errorString = `Error fetching "${url}".`;

  const response = await fetch(productGroupsUrl.href);
  if (!response.ok) {
    throw new Error(errorString);
  }

  return response.json();
};

export const getProductGroups = async () => {
  try {
    const json = await get<StringListResponse>(productGroupsUrl.href);
    // The response contains HTML entities
    // In general it is not a good idea to return HTML in the responses.
    // That is because you assume your only client is a webbrowser, which is not always true.
    // Because of that, I have added this next step to decode HTML entities.
    return json.data.map((product: string) => he.decode(product));
  } catch (err) {
    throw new Error("Error fetching product groups.");
  }
};
