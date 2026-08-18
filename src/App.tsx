import { AppProvider } from "./state/store";
import { Shell } from "./app/Shell";

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
