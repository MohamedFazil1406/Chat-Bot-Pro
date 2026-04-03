type Props = {
  icon: React.ElementType;
  title: string;
  value: string;
};

export default function Statcard({ title, value, icon: Icon }: Props) {
  const isCustomer = title === "Total Customers";
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm max-w-52 ">
      <div className="flex justify-start items-center  gap-2">
        <Icon
          size={24}
          className={` ${isCustomer ? "text-green-600" : "text-blue-600"}`}
        />
        <p className="text-[#363553] font-bold">{title}</p>
      </div>

      <h2 className="text-2xl font-medium mt-2 text-center text-[#363553]">
        {value}
      </h2>
    </div>
  );
}
