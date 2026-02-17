const STORAGE_KEY = "tech-blog-posts";

const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("postsContainer");
const clearPostsBtn = document.getElementById("clearPostsBtn");
const postTemplate = document.getElementById("postTemplate");

const sanitize = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const getPosts = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePosts = (posts) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return date.toLocaleString();
};

const renderPosts = () => {
  const posts = getPosts();
  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p class="empty-state">No posts yet. Publish your first technical article.</p>';
    return;
  }

  posts.forEach((post) => {
    const node = postTemplate.content.firstElementChild.cloneNode(true);
    node.querySelector(".post-title").textContent = post.title;
    node.querySelector(".post-meta").textContent = `By ${post.author} · ${formatDate(post.createdAt)}`;
    node.querySelector(".post-tags").innerHTML = post.tags
      ? `Tags: ${sanitize(post.tags)}`
      : "Tags: none";
    node.querySelector(".post-content").textContent = post.content;
    postsContainer.appendChild(node);
  });
};

postForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(postForm);

  const newPost = {
    title: formData.get("title")?.toString().trim() ?? "",
    author: formData.get("author")?.toString().trim() ?? "",
    tags: formData.get("tags")?.toString().trim() ?? "",
    content: formData.get("content")?.toString().trim() ?? "",
    createdAt: new Date().toISOString(),
  };

  if (!newPost.title || !newPost.author || !newPost.content) {
    return;
  }

  const posts = getPosts();
  posts.unshift(newPost);
  savePosts(posts);
  renderPosts();
  postForm.reset();
});

clearPostsBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderPosts();
});

renderPosts();
