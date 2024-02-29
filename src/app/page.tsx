import { unstable_noStore as noStore } from "next/cache";
import { ClientWrapper } from "./clientwrapper";

export default async function Home() {
  noStore();

  return (
    <ClientWrapper />
  );
}
