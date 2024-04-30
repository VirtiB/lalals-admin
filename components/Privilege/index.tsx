import Image from "next/image";

const Privilege = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col gap-5 h-[85vh] overflow-y-hidden  items-center justify-center font-bold">
      <div className="flex justify-center items-center space-x-1 text-sm text-gray-700">
        <Image
          src="./images/access_denied.svg"
          alt="denied"
          objectFit="contain"
          width={250}
          height={250}
        />
      </div>
      <p>You dont have permission to read {name}</p>
    </div>
  );
};

export default Privilege;
