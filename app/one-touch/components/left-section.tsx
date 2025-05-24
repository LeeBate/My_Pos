import { getOneTouchFromApi } from "@/services/onetouchService";
import LeftSectionClient from "./left-section-client"; // import client component

const LeftSection = async () => {
  try {
    const oneTouchInfo = await getOneTouchFromApi();
    return <LeftSectionClient oneTouchInfo={oneTouchInfo} />;
  } catch (error: any) {
    return <div>Error fetching data {error}</div>;
  }
};

export default LeftSection;
