import React, { useContext, useState } from "react";
import AboutComponent from "./AboutComponent";
import AddPictureComponent from "./AddPictureComponent";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import AboutBodyMeasurement from "./AboutBodyMeasurement";
import { fetchUserData } from "@/apiService";
import { UserMetadata } from "@supabase/supabase-js";
import { UserMeta } from "@/context/userContext";
import { BASE_URL } from "@/constants";

function page() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ weight: "", height: "" });
  const [error, setError] = useState();
  const { step } = useParams();
  const navigate = useNavigate();
  const [bodyData, setBodyData] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const {userMeta, setUserMeta,refetch} = useContext(UserMeta);

  const handleNext = (stepName: string) => {
    if (stepName === "/about/bodymeasurement") {
      handleMeasurement();
    } else navigate(stepName);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setData((prev: any) => ({
      ...prev,
      [id]: value === "" ? "" : Number(value),
    }));
    setError("");
  };

  const handleImage = (file: any, name: string) => {
    const reader = new FileReader();
    const fileType = 'png';
    // Convert the file to base64
    reader.onloadend = () => {
      const base64String = reader.result as string; // base64 string

      // Update the state with the base64 string
      setData((prev) => ({
        ...prev,
        [name]: base64String,
      }));

      // Now send the API call with the base64 data
      uploadAsset(base64String, name, fileType);
    };

    // Read the file as a Data URL (base64 string)
    reader.readAsDataURL(file);
    //post api call uploadAsset
  };

  const uploadAsset = async (
    base64String: string,
    name: string,
    fileType: string
  ) => {
    setImageLoading(true);
    const supabaseID = localStorage.getItem(
      "sb-icowovrhkttxcopizqon-auth-token"
    );
    const parsedData = JSON.parse(supabaseID);
    const str = base64String.split(",")[1];
    // Extract the user ID
    const userID = parsedData?.user?.id;
    const type = "image";
    try {
      const res = await axios.post(`${BASE_URL}/matrix/uploadAsset`, {
        userID,
        type,
        fileType,
        base64: str,
      });
      setData((prev) => ({
        ...prev,
        [name + "id"]: res?.data?.id,
      }));
      setError("");
    } catch (error) {
      console.error(error);
    }
    setImageLoading(false);
  };
  const handleMeasurement = async () => {
    setLoading(true);
    const supabaseID = localStorage.getItem(
      "sb-icowovrhkttxcopizqon-auth-token"
    );
    const parsedData = JSON.parse(supabaseID);
    const userID = parsedData?.user?.id;

    try {
      const res = await axios.post(
        `${BASE_URL}/matrix/sizeMeasurement`,
        {
          height: data?.height,
          weight: data?.weight,
          frontImage: data?.FrontImageid,
          sideImage: data?.SideImageid,
          gender: data?.gender,
          userID: userID,
        }
      );

      setBodyData(res.data.data);
      setError("");
      navigate("/about/bodymeasurement", { replace: true });
    } catch (error) {
      setError(error.response.data.error);
      console.error(error);
    }
    setLoading(false);
  };

  const handleBodyData = (key: string, value: any) => {
    setBodyData((prev) => ({
      ...prev,
      [key]: key !== "size" ? Number(value) : value,
    }));
  };

  const finalizeBodyData = (key: string) => {
    setBodyData((prev) => {
      const rawValue = prev[key];
      const originalValue =
        typeof rawValue === "number" ? Number(rawValue) : rawValue;

      return {
        ...prev,
        [key]:
          key !== "size" && !isNaN(originalValue) ? Number(rawValue) : rawValue,
      };
    });
  };

  const handleBodyMeasurement = async () => {
    const supabaseID = localStorage.getItem(
      "sb-icowovrhkttxcopizqon-auth-token"
    );
    const parsedData = JSON.parse(supabaseID);
    const userID = parsedData?.user?.id;
    const payload = {
      userID,
      size_measurements: bodyData,
    };
    try {
      const res = await axios.post(
        `${BASE_URL}/matrix/sizeMeasurement`,
        payload,
        {
          params: { update: true },
        }
      );
      setBodyData(res?.data); 
      refetch(userID);
    } catch (error) {
      console.error(error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "frontpicture":
        return (
          <AddPictureComponent
            handleInput={handleInput}
            handleNext={handleNext}
            data={data}
            handleImage={handleImage}
            loading={loading}
            imageLoading={imageLoading}
            error={error}
          />
        );
      case "sidepicture":
        return (
          <AddPictureComponent
            handleInput={handleInput}
            handleNext={handleNext}
            data={data}
            handleImage={handleImage}
            loading={loading}
            imageLoading={imageLoading}
            error={error}
          />
        );
      case "bodymeasurement":
        return (
          <AboutBodyMeasurement
            bodyData={bodyData}
            handleBodyData={handleBodyData}
            handleBodyMeasurement={handleBodyMeasurement}
            finalizeBodyData={finalizeBodyData}
          />
        );
      default:
        return (
          <AboutComponent
            handleInput={handleInput}
            handleNext={handleNext}
            data={data}
            error={error}
            setError={setError}
            setData={setData}
          />
        );
    }
  };
  return <div>{renderStep()}</div>;
}

export default page;
