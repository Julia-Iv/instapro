import { formatDistanceToNow } from "./date-format.js";
import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, renderApp, user, page } from "../index.js";
import { setLike, removeLike } from "../api.js";

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
  const postsHtml = posts
    .map((post) => {
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
          <!-- Меняем ссылку на картинку в зависимости от post.isLiked -->
          <button data-post-id="${post.id}" class="like-button">
            <img src="./assets/images/${post.isLiked ? "like-active.svg" : "like-not-active.svg"}">
          </button>
          <!-- Выводим длину массива post.likes -->
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
    })
    .join(""); // Объединяем массив строк в одну общую HTML-строку

  // Добавляем заголовок профиля, если мы находимся на странице постов конкретного пользователя
  const pageTitleHtml =
    page === USER_POSTS_PAGE && posts.length > 0
      ? `<div class="user-profile-header">
        <p class="user-profile-header__title">Посты пользователя: <strong>${sanitizeHtml(posts[0].user.name)}</strong></p>
       </div>`
      : "";

  // Собираем итоговую разметку страницы
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
            ${pageTitleHtml}
      <ul class="posts">
        ${posts.length === 0 ? '<li class="post">У этого пользователя пока нет постов</li>' : postsHtml}
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

// НАСТРОЙКА ИНТЕРАКТИВНЫХ ЛАЙКОВ
const likeButtons = document.querySelectorAll(".like-button");

for (let likeButton of likeButtons) {
  likeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Предотвращаем лишние всплытия событий

    // Если пользователь не залогинен, запрещаем ставить лайки
    if (!user) {
      alert("Лайкать посты могут только авторизованные пользователи");
      return;
    }

    const postId = likeButton.dataset.postId;
    const currentPost = posts.find((post) => post.id === postId);
    const token = `Bearer ${user.token}`;

    // Выбираем нужное действие в зависимости от текущего статуса
    const apiAction = currentPost.isLiked ? removeLike : setLike;

    apiAction({ token, postId })
      .then((updatedPostData) => {
        // Ищем пост в локальном массиве и заменяем его на обновленный с сервера
        const postIndex = posts.findIndex((post) => post.id === postId);
        if (postIndex !== -1) {
          posts[postIndex] = updatedPostData.post;
        }
        // Мгновенно перерисовываем страницу, чтобы обновились сердечки и счетчики
        renderApp();
      })
      .catch((error) => {
        console.error(error);
        alert(
          error.message || "Что-то пошло не так при изменении статуса лайка.",
        );
      });
  });
}
}
