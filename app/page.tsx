import Header from "./components/Header";
import OneTouchList from "./one-touch/page";

export default function Home() {
  return (
    <div className="w-full max-h-screen">
      <Header />
      <OneTouchList />
    </div>
  );
}
