const _ = require("lodash");

// Dummy Test Function
const dummy = (blogs) => {
  return 1;
};

// Total likes function
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

//Favorite blog Function
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;

  const favorite = blogs.reduce((prev, current) => {
    return current.likes > prev.likes ? current : prev;
  });

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  };
};

//Most Blogs Function
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;

  const authorCounts = _.countBy(blogs, "author");

  const topAuthor = Object.keys(authorCounts).reduce((top, author) => {
    return authorCounts[author] > authorCounts[top] ? author : top;
  });

  return {
    author: topAuthor,
    blogs: authorCounts[topAuthor],
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
