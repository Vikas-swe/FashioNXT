import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import FrontImage from "../../assets/FrontImage.png";
import SideImage from "../../assets/SideImage.png";
import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import Loader from "./../../assets/Loader.jsx";

interface AddPictureComponentProps {
  handleInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: (stepName: string) => void;
  data: object;
  handleImage: (file: any, name: string) => void;
  loading: boolean;
  imageLoading: boolean;
  error: object;
}

function AddPictureComponent(props: AddPictureComponentProps) {
  const { step } = useParams();
  const { handleNext, data, handleImage, loading, imageLoading, error } = props;
  const stepName = step === "frontpicture" ? "Front" : "Side";

  const handleBack = () => {
    if (step === "frontpicture") {
      handleNext("/about");
    } else {
      handleNext("/about/frontpicture");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const name = stepName === "Front" ? "FrontImage" : "SideImage";
    handleImage(file, name);
  };

  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const openCamera = () => {
    setShowCamera(true);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" } })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      })
      .catch((error) => console.error("Error accessing camera:", error));
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Draw the video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to a base64 string (data URI)
        const imageData = canvas.toDataURL("png");

        // Convert the base64 string to a Blob
        const blob = dataURItoBlob(imageData);

        // Set the name based on the step (Front or Side)
        const name = stepName === "Front" ? "FrontImage" : "SideImage";

        // Pass the Blob to handleImage for further processing
        handleImage(blob, name);

        // Stop the camera stream to release resources
        const tracks = (video.srcObject as MediaStream)?.getTracks();
        tracks?.forEach((track) => track.stop());

        // Close the camera view
        setShowCamera(false);
      }
    }
  };

  const closeCamera = () => {
    if (videoRef.current) {
      const tracks = (videoRef.current.srcObject as MediaStream)?.getTracks();
      tracks?.forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    return new Blob([arrayBuffer], { type: mimeString });
  };

  const PictureComponent = () => {
    const isStepFront = step === "frontpicture";
    const uploadedImage = isStepFront ? data?.FrontImage : data?.SideImage;

    const renderHeader = () => {
      if (uploadedImage) {
        return (
          <div className="flex flex-col gap-2 mb-6">
            <div className="font-bold text-2xl">Welcome to App</div>
            <div className="text-sm">
              Your account has been successfully created. Let's make your
              community better together.
            </div>
          </div>
        );
      }
      return (
        <div className="font-bold text-3xl mb-12">
          Add Your {stepName} Profile
        </div>
      );
    };

    const renderActions = () => {
      if (uploadedImage) {
        return (
          <>
            <Button
              className={`${
                imageLoading ? "bg-gray-400" : "bg-black"
              } text-white w-full rounded-[124px] border-[1px] border-black`}
              onClick={() =>
                handleNext(
                  isStepFront ? "/about/sidepicture" : "/about/bodymeasurement"
                )
              }
              disabled={imageLoading}
            >
              Confirm Now
            </Button>
            {/* <Button
              // className="bg-black text-white w-full rounded-[124px] border-[1px] border-black"
              className={`${
                imageLoading ? "bg-gray-400" : "bg-black"
              }  text-white w-full rounded-[124px] border-[1px] border-black`}
              onClick={openCamera}
              disabled={imageLoading}
            >
              Open Camera
            </Button> */}

            <label className="w-full">
              <Input
                id="picture"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                disabled={imageLoading}
              />
              <div
                className={`${
                  imageLoading ? "bg-gray-400" : "bg-white"
                } text-black w-full rounded-[124px] border-[1px] flex items-center justify-center cursor-pointer p-2 border border-black`}
              >
                Retake
              </div>
            </label>
          </>
        );
      }

      return (
        <>
          {/* <Button
            className="bg-black text-white w-full rounded-[124px] border-[1px] border-black"
            onClick={openCamera}
          >
            Open Camera
          </Button> */}
          <label className="w-full">
            <Input
              id="picture"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className={`${
                imageLoading ? "bg-gray-400" : "bg-black"
              } text-white w-full rounded-[124px] flex items-center justify-center cursor-pointer p-2`}
            >
              Add Picture
            </div>
          </label>
          <Button
            className="bg-white text-black w-full rounded-[124px]"
            onClick={() =>
              handleNext(isStepFront ? "/about/sidepicture" : "/products")
            }
          >
            Skip
          </Button>
        </>
      );
    };

    return (
      <div>
        <div className="mb-6">
          <Button
            variant="outline"
            size="icon"
            className="border-0 rotate-180 w-fit"
            onClick={handleBack}
          >
            <ChevronRight className="!w-6 !h-6" />
          </Button>
        </div>
        <div className="flex flex-col gap-2">{renderHeader()}</div>
        {imageLoading ? (
          <div
            className="shadow-[0px_2px_6px_0px_rgba(68,150,247,0.5)] h-[409px] rounded-2xl flex justify-center align-middle py-2 px-2] items-center"
            role="status"
          >
            <Loader />
          </div>
        ) : (
          <div className="shadow-[0px_2px_6px_0px_rgba(68,150,247,0.5)] h-[409px] rounded-2xl flex justify-center align-middle py-2 px-2">
            <img
              src={uploadedImage || (isStepFront ? FrontImage : SideImage)}
              alt={`${stepName} Image`}
            />
          </div>
        )}
        <div className="mt-6 flex flex-col gap-6">{renderActions()}</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <img
          src="https://i.pinimg.com/originals/b5/db/46/b5db46949d9005be06ebf248ab1dbb00.gif"
          alt="Loading Animation"
          className="w-[20rem] h-[20rem]"
        />
      </div>
    );
  }

  return (
    <div className="px-4 py-3 h-screen">
      {showCamera && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col justify-center items-center z-[1]">
          <video ref={videoRef} className="w-full max-w-md rounded" />
          <canvas ref={canvasRef} className="hidden" width={640} height={480} />
          <div className="flex gap-4 mt-4">
            <Button className="bg-green-500 text-white" onClick={captureImage}>
              Capture
            </Button>
            <Button className="bg-red-500 text-white" onClick={closeCamera}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <PictureComponent />
    </div>
  );
}

export default AddPictureComponent;
