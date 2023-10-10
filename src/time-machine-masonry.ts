import '@appnest/masonry-layout';

import {LitElement, css, html} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';

import {Util, IHash} from './lib/Util';
import {Incident} from './lib/Incident';

import {
  NoImageImg,
  NewsIconOutlineSVG,
  MusicIconSVG,
  MovieIconOutlineSVG,
} from './lib/Icon';

@customElement('time-machine-tile')
class TimeMachineTileElement extends LitElement {
  @property({type: String})
  src: string | null = '';

  @property({type: Boolean})
  reportBrokenImages: boolean = false;

  @property({type: String})
  teeeApiUrl: string = '';

  @property({type: String})
  noImageSrc?: string;

  @property({type: String})
  category?: string;

  @property({type: Boolean})
  showIcon: boolean = false;

  static override styles = css`
    :host {
      display: block;
    }

    .time-machine-tile-content {
      position: relative;
      margin: 0;
      padding: 0;
      background-color: var(--time-machine-background-color);
    }

    h1 {
      background-color: var(
        --time-machine-title-background-color,
        rgba(255, 255, 255, 0.7)
      );
      color: var(--time-machine-title-color, rgba(0, 0, 0, 1));
      font-size: var(--time-machine-title-font-size, 16px);
      margin: 0;
      padding: 4px 24px 4px 4px;
    }

    .time-machine-tile.with-image h1 {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
    }

    img {
      border: 0;
      margin: 0;
      padding: 0;
      display: block;
      width: 100%;
      min-height: var(--time-machine-image-min-height, 375px);
      object-fit: cover;
      object-position: center;
    }

    p {
      margin: 0;
      padding: 4px;
      background-color: var(
        --time-machine-text-background-color,
        rgba(255, 255, 255, 0.5)
      );
      color: var(--time-machine-text-color, rgba(0, 0, 0, 1));
      font-size: var(--time-machine-text-font-size, 14px);
    }

    .time-machine-tile.with-image p {
      position: var(--time-machine-text-position, absolute);
      bottom: 0;
      left: 0;
      right: 0;
      max-height: var(--time-machine-text-max-height, 150px);
      overflow-y: auto;
    }

    hr {
      background-image: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0),
        var(--time-machine-ruler-color, rgba(0, 0, 0, 1)),
        rgba(0, 0, 0, 0)
      );
      border: 0;
      height: 1px;
      margin-top: 32px;
    }

    span.category-icon {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      color: var(
        --time-machine-icon-color,
        var(--time-machine-title-color, rgba(0, 0, 0, 1))
      );
      margin: 4px;
    }

    span.category-icon svg {
      width: 24px;
    }
  `;

  override render() {
    if (this.hasImage()) {
      return html`<div class="time-machine-tile with-image">
        ${this.renderContent()}
      </div>`;
    }
    return html`<div class="time-machine-tile">${this.renderContent()}</div>`;
  }

  renderContent() {
    return html`<div class="time-machine-tile-content">
        ${this.renderTitle()} ${this.renderCategoryIcon()} ${this.renderImage()}
        ${this.renderTextContent()}
      </div>
      <hr /> `;
  }

  hasImage() {
    return !!this.src;
  }

  renderTitle() {
    if (this.title) {
      return html`<h1 class="time-machine-tile-title">${this.title}</h1>`;
    }
    return html``;
  }

  renderImage() {
    if (this.src) {
      return html`<img @error=${this._handleImageLoadError} src=${this.src} />`;
    }
    return html``;
  }

  renderTextContent() {
    if (this.textContent) {
      return html`<p>${this.textContent}</p>`;
    }
    return html``;
  }

  renderCategoryIcon() {
    let categoryIcon;
    switch (this.category) {
      case 'newsItem':
        categoryIcon = NewsIconOutlineSVG;
        break;
      case 'radioSong':
        categoryIcon = MusicIconSVG;
        break;
      case 'cinemaMovie':
        categoryIcon = MovieIconOutlineSVG;
        break;
    }

    if (this.category && this.showIcon && categoryIcon) {
      return html`<span class="category-icon" title="${this.category}"
        >${unsafeHTML(categoryIcon)}</span
      >`;
    }
    return html``;
  }

  _handleImageLoadError = () => {
    console.debug(`Error loading image: ${this.src}`);
    const noImageSrc = this.noImageSrc || NoImageImg;

    // don't try to set the image source if it
    // has already been set
    if (this.src == noImageSrc) {
      return;
    }

    // report broken images back to the server
    if (this.reportBrokenImages) {
      Util.reportBrokenImage(this.teeeApiUrl, this.id, this.src);
    }

    // wait a bit before setting the image
    // so we don't hammer the no image server
    setTimeout(() => {
      this.src = noImageSrc;
    }, 250);

    return false;
  };
}

@customElement('time-machine')
export class TimeMachine extends LitElement {
  public loading: boolean = false;
  public teeeApiUrl: string = 'https://public.api.v0.tee-e.com';
  public reportBrokenImages: boolean = false;

  @property({type: String})
  date: string = '';

  @property({type: String})
  country: string = '';

  @property({type: String})
  category: string = '';

  @property({type: String})
  emotion: string = '';

  @property({type: String})
  impact: string = '';

  @property({type: String})
  from: string = '';

  @property({type: String})
  to: string = '';

  @property({type: Boolean})
  shuffle: boolean = false;

  @property({type: Boolean, attribute: 'show-sources'})
  showSources: boolean = false;

  @property({type: Boolean, attribute: 'show-icons'})
  showIcons: boolean = false;

  @property({type: String, attribute: 'no-image-src'})
  noImageSrc: string = '';

  @query('masonry-layout')
  _container?: HTMLElement;

  static override styles = css`
    :host {
      color: var(--time-machine-text-color, black);
      background: var(--time-machine-background-color, white);
    }
  `;

  constructor() {
    super();
  }

  override connectedCallback() {
    console.debug('connectedCallback');
    super.connectedCallback();
    this.fetchHistory(
      this.country,
      this.category,
      this.emotion,
      this.impact,
      this.date,
      this.from,
      this.to
    );
  }

  override disconnectedCallback() {
    console.debug('disconnectedCallback');
    super.disconnectedCallback();
  }

  override attributeChangedCallback(
    name: string,
    _old: string | null,
    value: string | null
  ): void {
    console.debug('attributeChangedCallback: ', name, _old, value);
    super.attributeChangedCallback(name, _old, value);
    // this.fetchHistory(this.country, this.category, this.emotion, this.impact, this.date, this.from, this.to);
  }

  override render() {
    console.debug('render');
    return html`
      <div class="time-machine-container">
        <masonry-layout></masonry-layout>
      </div>
    `;
  }

  override firstUpdated() {
    console.debug('firstUpdated');
  }

  async fetchHistory(
    countries: string,
    categories: string,
    emotions: string,
    impacts: string,
    dateString: string,
    fromString: string,
    toString: string
  ) {
    console.debug('fetchHistory');
    // Set defaults to explicit empty string.
    countries = countries || '';
    categories = categories || '';
    emotions = emotions || '';
    impacts = impacts || '';

    try {
      // if (!countries) {
      //   throw 'No country specified';
      // }
      const urls: string[] = [];
      if (dateString) {
        const date = new Date(dateString).toISOString().substring(0, 10);
        categories.split(',').forEach((category) => {
          urls.push(
            `${this.teeeApiUrl}/${date}?country=${countries}&category=${category}&emotion=${emotions}&impact=${impacts}&limit=20`
          );
        });
      } else if (fromString && toString) {
        const from = new Date(fromString).toISOString().substring(0, 10);
        const to = new Date(toString).toISOString().substring(0, 10);
        categories.split(',').forEach((category) => {
          urls.push(
            `${this.teeeApiUrl}/?from=${from}&to=${to}&country=${countries}&category=${category}&emotion=${emotions}&impact=${impacts}&limit=20`
          );
        });
      } else {
        throw 'No correct date or period specified.';
      }
      this.loading = true;

      const sourcesFoundInIncidents: IHash = {};
      let incidents: Array<Incident> = [];

      await Util.asyncForeach(urls, async (url: string) => {
        const response = await fetch(url, {
          method: 'GET',
          // headers: {
          //   'Referrer': 'http://localhost:8000/'
          // }
        });
        const json = await response.json();
        incidents = incidents.concat(json.results);
      });

      console.info(incidents);

      // Shuffle incidents.
      if (this.shuffle) {
        incidents = Util.shuffleArray(incidents);
      }

      const masonry = this._container;

      // Remove current set of slides.
      Util.removeAllChildren(masonry);

      // Add new set of slides.
      incidents.forEach((incident: Incident) => {
        const card = document.createElement(
          'time-machine-tile'
        ) as TimeMachineTileElement;

        card.reportBrokenImages = this.reportBrokenImages;
        card.teeeApiUrl = this.teeeApiUrl;
        card.noImageSrc = this.noImageSrc;
        card.showIcon = this.showIcons;

        card.id = incident.id;
        card.src = incident.image ? incident.image[0] : null;
        card.title = incident.title;
        card.textContent = incident.text;
        card.category = incident.category;

        if (incident.source) {
          sourcesFoundInIncidents[incident.source] = true;
        }

        masonry?.appendChild(card);
      });

      if (this.showSources && Object.keys(sourcesFoundInIncidents).length) {
        const sourcesBox = document.createElement('div');
        sourcesBox.classList.add('time-machine-tile-sources');
        sourcesBox.textContent = `Source: ${Object.keys(
          sourcesFoundInIncidents
        ).join(',')}`;
        masonry?.appendChild(sourcesBox);
      }

      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'time-machine': TimeMachine;
  }
}
