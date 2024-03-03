import { unstable_noStore as noStore } from "next/cache";
import { ParallaxText } from "./_components/parallax-text";
export default async function Home() {
  noStore();

  return (
    <main className="flex flex-col items-center justify-center min-h-[200vh] bg-black text-white">
      <ParallaxText desktopWidth={100} mobileWidth={100} className="p-5 bg-white/5 rounded-md max-w-lg">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserun
        mollit anim id est laborum.
      </ParallaxText>
      <div className="fixed bottom-5 w-full bg-white/5 px-5">
        <span>Scroll down to repeat the parallax effect.</span>
      </div>
    </main>
  );
}
