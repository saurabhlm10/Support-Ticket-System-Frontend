const upstashRedRESTUrl = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL;
const authToken = process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN;

// type Command = "zrange" | "sismember" | "get" | "smembers";

export async function fetchRedis(command: string, ...args: string[]) {
  const commandUrl = `${upstashRedRESTUrl}/${command}/${args.join("/")}`;

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Error executing Redis command: ${response.statusText}`);
  }

  const data = await response.json();

  return data.result;
}
