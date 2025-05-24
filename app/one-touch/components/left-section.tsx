import { getOneTouchFromApi } from "@/services/onetouchService";
import LeftSectionClient from "./left-section-client"; // import client component

const LeftSection = async () => {
  try {
    const oneTouchInfo = await getOneTouchFromApi();
    return <LeftSectionClient oneTouchInfo={oneTouchInfo} />;
  } catch (error: any) {
    console.log("Error fetching OneTouch data:", error);
    return <div>Error fetching data </div>;
  }
};

export default LeftSection;
