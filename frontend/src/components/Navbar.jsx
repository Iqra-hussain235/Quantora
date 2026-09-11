import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { logout } from "@/config/redux/reducer/authReducer";

export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-white shadow p-4 flex justify-between">

      <h1 className="font-bold">Dashboard</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>

    </div>
  );
}