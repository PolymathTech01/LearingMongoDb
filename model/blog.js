import mongoose from 'mongoose';
const { Schema, model, SchemaTypes } = mongoose;

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  author: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  content: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: () => Date.now(), // this will make the date change anytime a new document is created
    immutable: true, // this means it wont be updated after the document had been created and it had been filled
  },
  updatedAt: Date,
  comments: [
    {
      user: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
      content: String,
      votes: Number,
    },
  ],
});
blogSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Blog = model('Blog', blogSchema);

export default Blog;
