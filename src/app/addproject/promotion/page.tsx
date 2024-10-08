import InfoBar from "@/components/infobar";
import Promotion from "./promotion";
import { Navbar } from "@/components";

const PromotionPage = () => {
  return (
    <div className="h-screen">
      <Navbar />
      <div style={{ paddingTop: "60px" }}>
        <InfoBar />
        <Promotion />
      </div>
    </div>
  );
};

export default PromotionPage;
