import { useCallback, useMemo, useState } from "react";
import Card from "../../components/Card";
import SearchBar from "../../components/SearchBar";
import UserRow from "../../components/UserRow";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialUsers } from "../../utils/mockData";

function Users() {
  const [users, setUsers] = useLocalStorage("users", initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const term = search.toLowerCase().trim();
    return users.filter(
      (user) =>
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.role.toLowerCase().includes(term),
    );
  }, [users, search]);

  const activeCount = useMemo(
    () => users.filter((user) => user.status === "Active").length,
    [users],
  );

  const toggleStatus = useCallback(
    (userId) => {
      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? { ...user, status: user.status === "Active" ? "Inactive" : "Active" }
            : user,
        ),
      );
    },
    [setUsers],
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Users</h1>
          <p className="mt-1 text-sm text-stone-500">
            {users.length} users · {activeCount} active
          </p>
        </div>

        <div className="w-full md:w-80">
          <SearchBar
            value={search}
            onChange={setSearch}
            label="Search users"
            placeholder="Search by name, email or role..."
          />
        </div>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-175 text-left text-sm">
            <thead className="bg-cream-100 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <UserRow key={user.id} user={user} onToggleStatus={toggleStatus} />
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <p className="p-10 text-center text-sm text-stone-500">No users found.</p>
        )}
      </Card>
    </div>
  );
}

export default Users;