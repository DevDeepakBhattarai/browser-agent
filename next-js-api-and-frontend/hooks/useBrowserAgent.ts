import { useToast } from "@/components/ui/use-toast";
import { EXTENSION_ID } from "@/lib/constant";
import { useDBIState } from "@/states/dbi-state";
import { useInputState } from "@/states/input-state";
import { processObjective } from "@/utils/processObjective";
import { sendToBackgroundViaRelay } from "@plasmohq/messaging";

export default function useBrowserAgent() {
  const { toast } = useToast();
  const { objective, setObjective, setIsDisabled, pastedContent } =
    useInputState();
  const { setIsLoading } = useDBIState();

  const handler = async (prompt?: string) => {
    setIsLoading(true);
    setIsDisabled(true);

    // @ts-expect-error This is just a type issue
    if (!chrome) {
      toast({
        title: "You must be in chromium based browser to use this feature",
      });
      return;
    }

    setObjective("");
    const processedObjective = processObjective(
      prompt ?? objective,
      pastedContent,
    );
    const response: { success: boolean } = await sendToBackgroundViaRelay({
      name: "task" as never,
      body: {
        objective: processedObjective,
        type: "write",
        objectiveId: crypto.randomUUID(),
      },
      extensionId: EXTENSION_ID,
    });

    setIsLoading(false);
    setIsDisabled(false);
    if (!response.success) {
      toast({
        title: "Unable to authenticate the user",
        variant: "destructive",
      });
    }
  };

  return { browserAgentHandler: handler };
}
