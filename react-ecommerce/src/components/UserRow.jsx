import { memo } from "react";
import { getInitials, getStatusClasses } from "../utils/helpers";

const UserRow = memo(function UserRow({ user, onToggleStatus }) {
  const isActive = user.status === "Active";

  return (
    <tr className="border-t border-stone-200">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cream-200 text-xs font-bold text-brand-700">
            {getInitials(user.name)}
          </span>
          <span className="font-medium text-stone-900">{user.name}</span>
        </div>
      </td>
      <td className="px-5 py-4 text-stone-500">{user.email}</td>
      <td className="px-5 py-4 text-stone-700">{user.role}</td>
      <td className="px-5 py-4">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(user.status)}`}>
          {user.status}
        </span>
      </td>
      <td className="px-5 py-4">
        <button
          type="button"
          onClick={() => onToggleStatus(user.id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            isActive
              ? "border border-stone-300 text-stone-700 hover:bg-cream-100"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          {isActive ? "Deactivate" : "Activate"}
        </button>
      </td>
    </tr>
  );
});

export default UserRow;