import { getOneTouchFromApi } from "@/services/onetouchService";
import LeftSectionClient from "./left-section-client"; // import client component

const LeftSection = async () => {
  try {
    const oneTouchInfo = await getOneTouchFromApi();

    console.log('oneTouchInfo@@',oneTouchInfo)
    return <LeftSectionClient oneTouchInfo={oneTouchInfo} />;
  } catch (error) {
    return <div>Error fetching data</div>;
  }
};

export default LeftSection;
