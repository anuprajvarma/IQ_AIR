import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface mapType {
  height: string;
  width: string;
  lng: number;
  lat: number;
}

export const Map = ({ lat, lng, width, height }: mapType) => {
  const containerStyle = {
    width,
    height,
  };

  const center = {
    lat,
    lng,
  };

  return (
    <div className="w-[30rem]">
      <LoadScript googleMapsApiKey={"AIzaSyA3gd1Jhq-5xo7IvZ_dCn9fiiLEefSiR6M"}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
          <Marker position={center} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};
