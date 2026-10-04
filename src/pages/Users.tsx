import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUsers, createUser, deleteUserById, updateUserById, UserItem } from "../Api";
import Nav from "../components/nav";
import Footer from "../components/footer";
import LoadingSpinner from "../components/loading";
import CapsuleButton from "../components/capsule_button";
import PopTitle from "../components/pop_title";
import { motion, AnimatePresence } from "framer-motion";
import { HiPlus, HiX, HiCheck } from "react-icons/hi";

const UsersPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, user: currentUsername } = useAuth();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);

  // Form states - Create
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // Form states - Edit
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memuat daftar user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="relative min-h-screen bg-pink flex items-center justify-center">
        <div className="w-12 h-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmittingCreate(true);
    try {
      const res = await createUser({
        username: newUsername.trim(),
        email: newEmail.trim(),
        password: newPassword,
      });
      setSuccess(res.message || "User baru berhasil dibuat!");
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setShowCreateModal(false);
      await loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal membuat user");
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    setError(null);
    setSuccess(null);
    setSubmittingEdit(true);
    try {
      const payload: { email?: string; password?: string } = {};
      if (editEmail.trim() !== "") payload.email = editEmail.trim();
      if (editPassword !== "") payload.password = editPassword;

      const res = await updateUserById(editUser.id, payload);
      setSuccess(res.message || "User berhasil diperbarui!");
      setEditUser(null);
      setEditEmail("");
      setEditPassword("");
      await loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui user");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDelete = async (userItem: UserItem) => {
    if (userItem.username === currentUsername) {
      setError("Kamu tidak dapat menghapus akunmu sendiri!");
      return;
    }
    const confirmed = window.confirm(`Yakin ingin menghapus user "${userItem.username}"?`);
    if (!confirmed) return;

    setError(null);
    setSuccess(null);
    setDeletingId(userItem.id);
    try {
      const res = await deleteUserById(userItem.id);
      setSuccess(res.message || `User "${userItem.username}" berhasil dihapus.`);
      await loadUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menghapus user");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-pink text-black-100">
      <Nav text="USER MANAGEMENT" />

      <main className="grow max-w-4xl w-full mx-auto p-4 md:p-8">
        {/* Banner Notifikasi */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-white border-2 border-red rounded-2xl flex items-center justify-between shadow-md"
            >
              <span className="text-red font-bold text-sm md:text-base">{error}</span>
              <button onClick={() => setError(null)} className="text-red font-bold p-1 cursor-pointer">
                <HiX className="text-xl" />
              </button>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-4 bg-white border-2 border-green rounded-2xl flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2 text-green font-bold text-sm md:text-base">
                <HiCheck className="text-xl" />
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className="text-green font-bold p-1 cursor-pointer">
                <HiX className="text-xl" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border-2 border-black-200 rounded-3xl p-6 shadow-lg mb-6">
          <div>
            <PopTitle text="Akun Pengguna" className="text-4xl md:text-5xl" />
          </div>
          <CapsuleButton
            onClick={() => setShowCreateModal(true)}
            className="bg-yellow-200 hover:bg-yellow-100 flex items-center gap-2"
          >
            <HiPlus className="text-lg" />
            <span>Tambah User</span>
          </CapsuleButton>
        </div>

        {/* Tabel User */}
        <div className="bg-white border-2 border-black-200 rounded-3xl p-4 md:p-6 shadow-lg overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <div className="w-12 h-12">
                <LoadingSpinner />
              </div>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center font-school text-xl text-gray-400">
              Belum ada user yang terdaftar.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Dibuat Pada</th>
                    <th className="py-3 px-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-desc">
                  {users.map((u) => {
                    const isSelf = u.username === currentUsername;
                    return (
                      <tr key={u.id} className="hover:bg-yellow-100/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-gray-400">#{u.id}</td>
                        <td className="py-3.5 px-4 font-bold text-black-100 flex items-center gap-2">
                          <span>{u.username}</span>
                          {isSelf && (
                            <span className="text-xs bg-blue text-white px-2 py-0.5 rounded-full font-sans font-normal">
                              Kamu
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-gray-600">{u.email || "-"}</td>
                        <td className="py-3.5 px-4 text-sm text-gray-500">{u.created_at || "-"}</td>
                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <CapsuleButton
                              onClick={() => {
                                setEditUser(u);
                                setEditEmail(u.email || "");
                                setEditPassword("");
                              }}
                              className="bg-yellow-200 text-xs py-1 px-3.5"
                            >
                              Edit
                            </CapsuleButton>
                            <CapsuleButton
                              onClick={() => handleDelete(u)}
                              disabled={isSelf || deletingId === u.id}
                              className="bg-red text-white text-xs py-1 px-3.5"
                            >
                              {deletingId === u.id ? "..." : "Hapus"}
                            </CapsuleButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal Tambah User */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border-2 border-black-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black-100 p-1 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
              <PopTitle as="h2" text="Tambah Pengguna Baru" className="text-3xl mb-6" />

              <form onSubmit={handleCreateSubmit} className="flex flex-col gap-4 font-desc">
                <div>
                  <label className="block text-sm font-bold text-black-100 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Contoh: marugo_admin"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black-100 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black-100 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <CapsuleButton
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="bg-gray-100 hover:bg-gray-200"
                  >
                    Batal
                  </CapsuleButton>
                  <CapsuleButton
                    type="submit"
                    disabled={submittingCreate}
                    className="bg-blue text-white hover:brightness-110"
                  >
                    {submittingCreate ? "Menyimpan..." : "Simpan User"}
                  </CapsuleButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Edit User */}
      <AnimatePresence>
        {editUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white border-2 border-black-200 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setEditUser(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black-100 p-1 cursor-pointer"
              >
                <HiX className="text-2xl" />
              </button>
              <PopTitle as="h2" className="text-3xl mb-6">
                Edit Pengguna <span className="text-blue">({editUser.username})</span>
              </PopTitle>

              <form onSubmit={handleEditSubmit} className="flex flex-col gap-4 font-desc">
                <div>
                  <label className="block text-sm font-bold text-black-100 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="nama@domain.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black-100 mb-1">
                    Password Baru (Kosongkan jika tidak diubah)
                  </label>
                  <input
                    type="password"
                    minLength={6}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-blue shadow-inner"
                  />
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <CapsuleButton
                    type="button"
                    onClick={() => setEditUser(null)}
                    className="bg-gray-100 hover:bg-gray-200"
                  >
                    Batal
                  </CapsuleButton>
                  <CapsuleButton
                    type="submit"
                    disabled={submittingEdit}
                    className="bg-blue text-white hover:brightness-110"
                  >
                    {submittingEdit ? "Menyimpan..." : "Perbarui"}
                  </CapsuleButton>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default UsersPage;
