"use client";
import ReloadDetector from "./ReloadDetector";
import BackDetector from "./BackDetector";
import ReloadPreventer from "./ReloadPreventer";

const ReloadAndBackHandler = () => {
  return (
    <>
      <ReloadDetector />
      <BackDetector />
      <ReloadPreventer />
    </>
  );
};

export default ReloadAndBackHandler;
