import Image from "next/image";

const Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen z-50">
      <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
        <Image
          src="./images/logo/lalals-logo-solo.svg"
          alt="loader"
          objectFit="contain"
          width={60}
          height={60}
        />
      </div>
    </div>
  );
};
export default Loading;
