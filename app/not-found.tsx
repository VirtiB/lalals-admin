import Image from "next/image";

export default function NotFound() {
  return (
    <div>
      <div className="flex flex-col gap-5 h-[85vh] overflow-y-hidden  items-center justify-center font-bold">
        <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
          <Image
            src="./images/404.svg"
            alt="404"
            objectFit="contain"
            width={250}
            height={250}
          />
        </div>
        <div>Page not found</div>
      </div>
    </div>
  );
}
