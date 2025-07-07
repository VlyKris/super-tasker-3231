import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

type SyncError = {
  error: string;
  stack: string;
  filename: string;
  lineno: number;
  colno: number;
};

type AsyncError = {
  error: string;
  stack: string;
};

type GenericError = SyncError | AsyncError;

export function InstrumentationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<GenericError | null>(null);

  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      try {
        console.log(event);
        event.preventDefault();
        setError({
          error: event.message,
          stack: event.error?.stack || "",
          filename: event.filename || "",
          lineno: event.lineno,
          colno: event.colno,
        });

        if (import.meta.env.VITE_VLY_APP_ID) {
          await fetch(import.meta.env.VITE_VLY_MONITORING_URL, {
            method: "POST",
            body: JSON.stringify({
              error: event.message,
              url: window.location.href,
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
              stackTrace: event.error?.stack,
              projectSemanticIdentifier: import.meta.env.VITE_VLY_APP_ID,
            }),
          });
        }
      } catch (error) {
        console.error("Error in handleError:", error);
      }
    };

    const handleRejection = async (event: PromiseRejectionEvent) => {
      try {
        console.error(event);

        if (import.meta.env.VITE_VLY_APP_ID) {
          await fetch(import.meta.env.VITE_VLY_MONITORING_URL, {
            method: "POST",
            body: JSON.stringify({
              error: event.reason.message,
              url: window.location.href,
              stackTrace: event.reason.stack,
              projectSemanticIdentifier: import.meta.env.VITE_VLY_APP_ID,
            }),
          });
        }

        setError({
          error: event.reason.message,
          stack: event.reason.stack,
        });
      } catch (error) {
        console.error("Error in handleRejection:", error);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
  return (
    <>
      {children}
      {error && (
        <Dialog
          defaultOpen={true}
          onOpenChange={() => {
            setError(null);
          }}
        >
          <DialogContent className="bg-red-700 text-white max-w-4xl">
            <DialogHeader>
              <DialogTitle>Runtime Error</DialogTitle>
            </DialogHeader>
            A runtime error occurred. Open the vly editor to automatically debug
            the error.
            <div className="mt-4">
              <Collapsible>
                <CollapsibleTrigger>
                  <div className="flex items-center font-bold cursor-pointer">
                    See error details <ChevronDown />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="max-w-[460px]">
                  <div className="mt-2 p-3 bg-neutral-800 rounded text-white text-sm overflow-x-auto max-h-60 max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <pre className="whitespace-pre">{error.stack}</pre>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <DialogFooter>
              <a
                href={`https://vly.ai/project/${import.meta.env.VITE_VLY_APP_ID}`}
                target="_blank"
              >
                <Button>
                  <ExternalLink /> Open editor
                </Button>
              </a>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
