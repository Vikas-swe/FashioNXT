import React, { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
interface AddPictureComponentProps {
  bodyData: object;
  handleBodyData: (key: string, value: number) => void;
  handleBodyMeasurement: () => void;
  finalizeBodyData: (key: string) => void;
}

function AboutBodyMeasurement(props: AddPictureComponentProps) {
  const { handleBodyData, bodyData, handleBodyMeasurement, finalizeBodyData } =
    props;
  const [isEditing, setIsEditing] = useState("");
  const navigate = useNavigate();
  return (
    <div className="px-4 py-3 h-screen flex flex-col gap-6">
      <div className="font-bold text-xl mb-2 mt-8">Body Measurement</div>
      <div className="grid grid-cols-2 grid-rows-2 gap-4">
        {Object.entries(bodyData).map(([key, value]) => {
          return (
            <div className=" h-[78px] rounded-[6px] border border-[##E5E7EB] shadow-[0_4px_4px_0_rgba(174,174,174,0.25)] py-3 px-3 flex items-center justify-between">
              <div>
                {isEditing !== key ? (
                  <h1>
                    {typeof value === "number"
                      ? Number(value).toFixed(2) + "IN"
                      : value}
                  </h1>
                ) : (
                  <Input
                    id={key}
                    value={value}
                    className="max-w-[5rem] h-9 m-0"
                    onChange={(e) => handleBodyData(key, e.target.value)}
                    onBlur={() => finalizeBodyData(key)}
                  />
                )}
                <h3>{key}</h3>
              </div>
              <Pencil
                onClick={() =>
                  setIsEditing((prev) => (prev === key ? "" : key))
                }
              />
            </div>
          );
        })}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="w-full rounded-[124px]"
            onClick={() => handleBodyMeasurement()}
          >
            Confirm Now
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[22rem]">
          <DialogHeader>
            <DialogTitle className="text-[20px]">Success!</DialogTitle>
            <DialogDescription>
              Your account has successfully been created
            </DialogDescription>
          </DialogHeader>
          <div
            className="text-center mt-4"
            onClick={() => navigate("/products", { replace: true })}
          >
            Go to Products
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AboutBodyMeasurement;
