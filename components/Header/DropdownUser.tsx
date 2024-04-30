import Link from "next/link";
import Image from "next/image";

const DropdownUser = () => {
  return (
    <div className="relative">
      <Link className="flex items-center gap-4" href="">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            Lalals Admin
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          <Image
            width={112}
            height={112}
            src={"/images/user/user-01.png"}
            alt="User"
          />
        </span>
      </Link>
    </div>
  );
};

export default DropdownUser;
