import { NewsEntity } from '../news/news.entity';

export const newsTemplate = (news: NewsEntity[], commentsTemplate?: string) => {
  if (news?.length === 0) {
    return emptyNews();
  }
  let html = '<div class="row">';
  for (const newsItem of news) {
    html += `
            <div class="col-lg-5">
                <div class="card">
                <img src='http://localhost:3333/${newsItem?.cover}' class="card-img-top"
style="height: 200px; object-fit: cover;" alt=''>
                    <div class="card-body">
                      <h5 class="card-title">${newsItem.title}</h5>
                      <h6 class="card-subtitle mb-2 text-muted">
                         Категория: ${newsItem.category?.name}
                       </h6>
                       <h6 class="card-subtitle mb-2 text-muted">
                         Автор: ${newsItem.user?.firstName}
                       </h6>
                       <h6 class="card-subtitle mb-2 text-muted">
                        Дата создания: ${newsItem.createdAt}
                       </h6>
                       <p class="card-text">${newsItem.description}</p>
                    </div>
                </div>
            </div>
            ${commentsTemplate}
            `;
  }

  html += '</div>';
  return html;
};
const emptyNews = () => {
  return `<h1>Список новостей пуст!</h1>`;
};
