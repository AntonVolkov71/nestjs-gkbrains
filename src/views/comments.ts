import { CommentsEntity } from '../news/comments/comments.entity';

export const commentsTemplate = (comments: CommentsEntity[] = []): string => {
  if (comments.length === 0) {
    return emptyComments();
  }

  let html = '<div class="row">';
  for (const commentsItem of comments) {
    html += `
            <h1 >
                ${commentsItem?.user?.firstName}
            </h1>
            <p >
                ${commentsItem.message}
            </p>
            `;
  }
  html += '</div>';
  return html;
};

const emptyComments = () => {
  return `<p>Комментариев нет</p>`;
};
