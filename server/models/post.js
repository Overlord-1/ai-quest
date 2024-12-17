import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxLength: [100, 'Title cannot be more than 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true
  },
  tags: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length <= 5;
      },
      message: 'Maximum 5 tags are allowed'
    }
  },
  categories: {
    type: [String],
    validate: {
      validator: function(tags) {
        return tags.length <= 5;
      },
      message: 'Maximum 5 categories are allowed'
    }
  },
  images: [{
    id: { 
      type: String, 
      required: true 
    },
    url: {
      type: String,
      required: true
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Post must have an author']
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users'
  }],
  comments: [commentSchema],
  views: {
    type: Number,
    default: 0,
    min: [0, 'Views cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Posts = mongoose.model('posts', postSchema);

export default Posts;