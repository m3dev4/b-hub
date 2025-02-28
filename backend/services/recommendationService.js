import Post from "../models/postModel.js";
import Skill from "../models/skillModel.js";
import User from "../models/userModel.js";

export const getRecommendedSkills = async (userId) => {
  try {
    const user = await User.findById(userId).populate("skills");
    if (!user || !user.skills.length) {
      return [];
    }

    const userSkills = user.skills.map((skill) => skill.name);
    const relatedSkills = await Skill.find({
      name: { $in: userSkills },
    }).populate("relatedSkills");

    const allRelevantSkills = new Set([
      ...userSkills,
      ...relatedSkills.flatMap((skill) => skill.relatedSkills),
    ]);

    const recommendedSkills = await Post.find({
      tags: { $in: Array.from(allRelevantSkills) },
      author: { $ne: userId },
      visibility: "public",
    })
      .populate("author", "username profilePicture")
      .sort({ createdAt: -1 })
      .limit(10);
    return recommendedSkills;
  } catch (error) {
    console.error("Error getting recommended skills:", error);
    throw error;
  }
};
