import mongoose from "mongoose";

const likeEntrySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    text: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const postSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorUsername: { type: String, required: true },
    text: { type: String, default: "", trim: true },
    imageUrl: { type: String, default: "" },
    likes: [likeEntrySchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  const hasText = typeof this.text === "string" && this.text.trim().length > 0;
  const hasImage = typeof this.imageUrl === "string" && this.imageUrl.trim().length > 0;
  if (!hasText && !hasImage) {
    this.invalidate("content", "Post must include text and/or an image.");
  }
  next();
});

export default mongoose.model("Post", postSchema);
