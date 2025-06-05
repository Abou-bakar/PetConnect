import { useState } from "react";

export default function UserProfile() {
  const [profile, setProfile] = useState({
    username: "petlover123",
    name: "John Doe",
    bio: "Animal enthusiast 🐾 | Proud owner of 2 cats and 1 dog",
    avatar: "https://via.placeholder.com/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...profile });

  const handleEdit = () => {
    setEditData({ ...profile });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-3">
      {/* Header */}
      <header className="text-center py-4 bg-[#65cadc] text-white">
        <h1 className="text-4xl font-bold">Pet-Profiles</h1>
      </header>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <img
            src={profile.avatar}
            alt={profile.username}
            className="w-32 h-32 rounded-full"
          />
          <div className="ml-6">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="text-2xl font-bold mb-2 p-1 border"
                />
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) =>
                    setEditData({ ...editData, username: e.target.value })
                  }
                  className="text-gray-600 mb-2 p-1 border"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-600">@{profile.username}</p>
              </>
            )}
          </div>
        </div>
        <button
          onClick={isEditing ? handleSave : handleEdit}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>
      {isEditing ? (
        <textarea
          value={editData.bio}
          onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
          className="w-full p-3 border rounded mb-6"
          rows="3"
        />
      ) : (
        <p className="text-gray-700 mb-6">{profile.bio}</p>
      )}
      <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((post) => (
          <div
            key={post}
            className="aspect-square bg-gray-100 rounded-lg"
          ></div>
        ))}
      </div>
      {/* Footer */}
      <footer className="bg-[#65cadc] text-white py-6 text-center mt-6">
        <p>© 2024 Pet Connect. All Rights Reserved.</p>
      </footer>
         
    </div>
  );
}
