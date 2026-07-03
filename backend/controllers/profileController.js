import User from "../models/User.js";

/* ✅ GET PROFILE */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

/* ✅ UPDATE PROFILE */
export const updateProfile = async (req, res) => {
  try {
    const { name, age, profession, photo } = req.body;

    const updateData = {};

    if (name) updateData.name = name;
    if (age) updateData.age = age;
    if (profession) updateData.profession = profession;
    if (photo) updateData.photo = photo;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Profile update failed",
      error: error.message
    });
  }
};