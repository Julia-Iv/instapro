import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = ""; // Локальная переменная, куда запишется URL загруженной картинки

  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить новый пост</h3>
        
        <!-- Контейнер для встраивания компонента загрузки картинки -->
        <div class="upload-image-container"></div>
        
        <div class="form-inputs">
          <label class="form-label">
            Опишите пост:
            <textarea class="input textarea" id="description-input" rows="4" placeholder="Введите описание здесь..."></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

        // Находим контейнер для загрузчика изображений
    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    // Интегрируем готовый компонент загрузки изображения
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl; // Запоминаем полученный URL-адрес из облака
        },
      });
    }

    document.getElementById("add-button").addEventListener("click", () => {
            const descriptionInput = document.getElementById("description-input");

      // Проверяем, заполнена ли форма перед отправкой
      if (!imageUrl) {
        alert("Пожалуйста, выберите и загрузите изображение");
        return;
      }
      if (!descriptionInput.value.trim()) {
        alert("Пожалуйста, введите описание к посту");
        return;
      }

      // Передаем в index.js реальные данные вместо статических заглушек
      onAddPostClick({
        description: descriptionInput.value,
        imageUrl: imageUrl,
      });
    });
  };

  render();
}

