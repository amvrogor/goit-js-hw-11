export { createMarkup };

function createMarkup(data) {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card"
          style="width: 400px;
          height: 280px;          
          border: 1px solid #eee;"
        >
          <a class="gallery-img" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}"
            loading="lazy"
            width=100%
            height=80%
            style="display: block;
            object-fit: cover"/>
          </a>
          <div class="info"
            style="padding: 10px;
            display: flex;
            justify-content: space-around;
            font-family: sans-serif;
            font-size: 13px"
          >
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Likes
              </b>
              ${likes}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Views
              </b>
              ${views}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Comments
              </b>
              ${comments}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Downloads
              </b>
              ${downloads}
            </p>
          </div>
    </div>`
    )
    .join('');
}
