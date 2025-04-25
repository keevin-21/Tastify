import { Footer } from "./footer";
import { Header } from "./header";

type Props = {
    children: React.ReactNode;
};

const MarketingLayout = ({ children }) => {
    return (
        <div className = "min-h-screen flex flex-col">

          <Header>

          </Header>
          <main className = "bg-[#1e1e1e] flex-1 flex flex-col items-center justify-center">
          {children}
          </main>
          <Footer />
        </div>
    );
};

export default MarketingLayout;