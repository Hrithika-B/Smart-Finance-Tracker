import { useEffect, useState } from "react";

function Profile() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    profession: "",
    photo: ""
  });

  /* ---------- LOAD PROFILE ---------- */
  const loadProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/profile/me", {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (!res.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await res.json();

      setForm({
        name: data.name || "",
        age: data.age || "",
        profession: data.profession || "",
        photo: data.photo || ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  /* ---------- HANDLE IMAGE ---------- */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        photo: reader.result
      }));
    };

    reader.readAsDataURL(file);
  };

  /* ---------- SAVE PROFILE ---------- */
  const save = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/profile/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
          },
          body: JSON.stringify(form)
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Profile update failed");
        return;
      }

      const data = await res.json();

      // 🔥 refresh UI after save
      setForm({
        name: data.name || "",
        age: data.age || "",
        profession: data.profession || "",
        photo: data.photo || ""
      });

      alert("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>My Profile</h2>

        {/* ---------- PHOTO ---------- */}
        <div className="avatar-section">
          <div className="avatar-box">
            {form.photo ? (
              <img src={form.photo} alt="profile" />
            ) : (
              <span>No Photo</span>
            )}
          </div>

          <label className="upload-btn">
            Change Photo
            <input type="file" hidden onChange={handleImage} />
          </label>
        </div>

        {/* ---------- FORM ---------- */}
        <div className="profile-form">
          <div className="field">
            <label>Name</label>
            <input
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Age</label>
            <input
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </div>

          <div className="field">
            <label>Profession</label>
            <input
              value={form.profession}
              onChange={(e) =>
                setForm({
                  ...form,
                  profession: e.target.value
                })
              }
            />
          </div>

          <button className="btn primary-btn" onClick={save}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;