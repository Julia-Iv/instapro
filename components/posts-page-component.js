import { formatDistanceToNow } from "./date-format.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage } from "../index.js";

// Простая функция экранирования для защиты от XSS
const sanitizeHtml = (htmlString) => {
  return htmlString
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
};

export function renderPostsPageComponent({ appEl }) {
  // @TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  // Генерируем массив строк HTML на основе актуальных данных из API
  const postsHtml = posts.map((post) => {
    // Форматируем дату создания поста относительно текущего времени
    const createDate = formatDistanceToNow(new Date(post.createdAt));

    return `
      <li class="post">
        <div class="post-header" data-user-id="${post.user.id}">
            <img src="${post.user.imageUrl}" class="post-header__user-image">
            <p class="post-header__user-name">${sanitizeHtml(post.user.name)}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <!-- Динамически меняем картинку в зависимости от того, лайкнул ли пост текущий пользователь -->
            <img src="./assets/images/${post.isLiked ? 'like-active.svg' : 'like-not-active.svg'}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${sanitizeHtml(post.user.name)}</span>
          ${sanitizeHtml(post.description)}
        </p>
        <p class="post-date">
          ${createDate}
        </p>
      </li>
    `;
  }).join(""); // Объединяем массив строк в одну общую HTML-строку
  
  // Собираем итоговую разметку страницы
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`;


  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  for (let userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
}
