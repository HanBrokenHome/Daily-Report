import { useNavigate } from "react-router-dom";

export default function VendorCard({ title }) {
  const navigate = useNavigate();

  return (
    <div
      className="card bg-base-200 shadow-md hover:bg-base-300 cursor-pointer"
      onClick={() => navigate(`/vendors/${title}`)}
    >
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
      </div>
    </div>
  );
}
