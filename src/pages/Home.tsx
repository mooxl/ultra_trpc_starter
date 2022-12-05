import { trpc } from "../trpc/trpc.ts";
import { tw } from "../twind/twind.ts";
const Home = () => {
  const simon = trpc.userById.useQuery("hallo");
  return (
    <div className={tw("bg-red-600")}>Home page of {simon.data?.name}</div>
  );
};

export default Home;
