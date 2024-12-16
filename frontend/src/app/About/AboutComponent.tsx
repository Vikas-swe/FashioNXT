import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { ChevronRight } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface AboutComponentProps {
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: (stepName: string) => void;
  data: object;
  setData: object;
  error: object;
  setError: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

type ErrorState = {
  height?: string;
  weight?: string;
};

function AboutComponent(props: AboutComponentProps) {
  const { handleInput, handleNext, data, error, setError, setData } = props;
  const navigate = useNavigate();
  const validateUserInput = (data: any) => {
    const newErrors: ErrorState = {};

    if (!data.height) {
      newErrors.height = "Please enter the height";
    }

    if (!data.weight) {
      newErrors.weight = "Please enter the weight";
    }

    setError(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    // const isValid = validateUserInput(data);
    if (isValid) {
      handleNext("frontpicture");
      setError({});
    }
  };

  const handleDropDown = (event) => {
    const { id, value, innerText } = event.target;
    setData((prev) => ({
      ...prev,
      gender: innerText,
    }));
  };

  const handleSkip = () => {
    setData((prev) => ({
      ...prev,
      height: "",
      weight: "",
      gender: "",
    }));
    handleNext("frontpicture");
  };

  return (
    <div className="px-4 py-3 h-screen">
      <div className="mb-12">
        <Button
          variant="outline"
          size="icon"
          className="border-0 rotate-180 w-fit"
          onClick={() => navigate(-1)}
        >
          <ChevronRight className="!w-6 !h-6" />
        </Button>
      </div>
      <div className="flex flex-col gap-2 mb-12">
        <div className="font-bold text-3xl">Tell Us About Yourself</div>
        <div className="text-[15px] opacity-60">
          Help us personalise your experience.
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <label>Gender</label>
          <Select
            value={data?.gender}
            onValueChange={(value: string) =>
              setData({ ...data, gender: value })
            }
          >
            <SelectTrigger className="w-full bg-[#F3F5F7]">
              <SelectValue placeholder="Select your Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="picture">Height (cm)</Label>
          <div>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              className="bg-[#F3F5F7]"
              onChange={handleInput}
              value={data?.height}
            />
            {/* {error?.height && (
              <p className="text-red-500 text-xs mt-2">{error?.height}</p>
            )} */}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Label htmlFor="picture">Weight (kg)</Label>
          <div>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              className="bg-[#F3F5F7]"
              onChange={handleInput}
              value={data?.weight}
            />
            {/* {error?.weight && (
              <p className="text-red-500 text-xs mt-2">{error?.weight}</p>
            )} */}
          </div>
        </div>
      </div>
      <div className="mt-9 flex flex-col gap-5">
        <Button
          className="bg-black text-white hover:bg-gray-800 w-full rounded-[124px]"
          onClick={() => handleNext("frontpicture")}
        >
          Continue
        </Button>
        <Button
          className="flex items-center w-full"
          //   className="bg-black text-white hover:bg-gray-800 w-full rounded-[124px]"
          onClick={handleSkip}
          variant="ghost"
        >
          Skip
        </Button>
      </div>
    </div>
  );
}

export default AboutComponent;
