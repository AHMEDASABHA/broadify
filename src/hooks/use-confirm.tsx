import { ResponsiveModel } from "@/components/dashboard/responsive-model";
import { Button, type ButtonProps } from "@/components/ui/button";
import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function useConfirm(
  title: string,
  message: string,
  variant: ButtonProps["variant"] = "default"
) {
  const [promise, setPromise] = useState<{
    resolve: (value: boolean) => void;
  } | null>(null);

  function confirm() {
    return new Promise<boolean>((resolve) => {
      setPromise({ resolve });
    });
  }

  function handleClose() {
    setPromise(null);
  }

  function handleConfirm() {
    promise?.resolve(true);
    handleClose();
  }

  function handleCancel() {
    promise?.resolve(false);
    handleClose();
  }

  function ConfirmationDialog() {
    return (
      <ResponsiveModel
        title={title}
        description={message}
        open={promise !== null}
        onOpenChange={handleClose}
      >
        <Card className="w-full h-full border-none shadow-none">
          <VisuallyHidden>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{message}</CardDescription>
          </VisuallyHidden>
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
          </CardContent>
          <div className="p-4 w-full flex flex-col lg:flex-row gap-x-2 items-center justify-end">
            <Button
              variant={"outline"}
              onClick={handleCancel}
              className="w-full lg:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={variant}
              className="w-full lg:w-auto"
            >
              Confirm
            </Button>
          </div>
        </Card>
      </ResponsiveModel>
    );
  }
  return [ConfirmationDialog, confirm];
}
