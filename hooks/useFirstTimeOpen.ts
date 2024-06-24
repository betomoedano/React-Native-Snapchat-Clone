import * as React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useFirstTimeOpen() {
  const [isFirstTime, setIsFirstTime] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkFirstTimeOpen() {
      try {
        const hasOpened = await AsyncStorage.getItem("hasOpened");
        if (hasOpened === null) {
          // First time opening the app
          setIsFirstTime(true);
        } else {
          setIsFirstTime(false);
        }
      } catch (error) {
        console.error("Failed to check if first time opening the app", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkFirstTimeOpen();
  }, []);

  return { isFirstTime, isLoading };
}
