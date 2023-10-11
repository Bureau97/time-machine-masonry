import '@appnest/masonry-layout';

import {LitElement, css, html, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, query, state} from 'lit/decorators.js';
import {unsafeHTML} from 'lit/directives/unsafe-html.js';
import {Task} from '@lit/task';

import {Util, IHash} from './lib/Util';
import {Incident} from './lib/Incident';

import {
  NoImageImg,
  NewsIconOutlineSVG,
  MusicIconSVG,
  MovieIconOutlineSVG,
} from './lib/Icon';

@customElement('time-machine')
export class TimeMachine extends LitElement {
  private sources: Array<string> = [];
  private _loading = false;

  get loading() {
    return this._loading;
  }

  set loading(value: boolean) {
    this._loading = value;
  }

  @property({type: String})
  teeeApiUrl: string = 'https://public.api.v0.tee-e.com';

  @property({type: Boolean, attribute: 'report-broken-images'})
  reportBrokenImages: boolean = false;

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

  @state()
  private incidents: Array<Incident> = [];

  static override styles = css`
    :host {
      color: var(--time-machine-text-color, black);
      background: var(--time-machine-background-color, white);
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

  constructor() {
    super();
  }

  override connectedCallback() {
    console.debug('connectedCallback');
    super.connectedCallback();
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
  }

  override firstUpdated(changedProperties: PropertyValues): void {
    console.debug('firstUpdated');
    super.firstUpdated(changedProperties);
  }

  override shouldUpdate(changedProperties: PropertyValues): boolean {
    console.debug('shouldUpdate');
    return super.shouldUpdate(changedProperties);
  }

  override update(changedProperties: PropertyValues) {
    console.debug('update');
    return super.update(changedProperties);
  }

  override updated(changedProperties: PropertyValues) {
    console.debug('updated');
    return super.updated(changedProperties);
  }

  override render() {
    console.debug('render');

    return html`
      <div class="time-machine-container">
        <masonry-layout>
          ${this._incidentsTask.render({
            pending: () => html`Loading data...`,
            complete: () => html`${this.renderTiles(this.incidents)}`,
          })}
        </masonry-layout>
        ${this.renderSources()}
      </div>
    `;
  }

  renderTiles(incidents: Incident[]) {
    console.debug('renderTiles');
    return html`${incidents.map((incident) => this.renderTile(incident))}`;
  }

  renderTile(incident: Incident): TemplateResult {
    console.debug('renderTile');
    const hasImage = !!incident.image;
    const tileContent: TemplateResult = this.renderTileContent(incident);

    if (hasImage) {
      return html`<div class="time-machine-tile with-image">
        ${tileContent}
      </div>`;
    }

    return html`<div class="time-machine-tile">${tileContent}</div>`;
  }

  renderTileContent(incident: Incident): TemplateResult {
    console.debug('renderTileContent');
    return html`<div class="time-machine-tile-content">
        ${this.renderTileTitle(incident)}
        ${this.renderTileCategoryIcon(incident)}
        ${this.renderTileImage(incident)}
        ${this.renderTileTextContent(incident)}
      </div>
      <hr /> `;
  }

  renderTileTitle(incident: Incident): TemplateResult {
    console.debug('renderTileTitle');
    if (incident.title) {
      return html`<h1 class="time-machine-tile-title">${incident.title}</h1>`;
    }
    return html``;
  }

  renderTileImage(incident: Incident): TemplateResult {
    console.debug('renderTileImage');
    if (incident.image) {
      return html`<img
        @error=${this._handleImageLoadError}
        src=${incident.image}
      />`;
    }
    return html``;
  }

  renderTileTextContent(incident: Incident): TemplateResult {
    console.debug('renderTileTextContent');
    if (incident.text) {
      return html`<p>${incident.text}</p>`;
    }
    return html``;
  }

  renderTileCategoryIcon(incident: Incident): TemplateResult {
    console.debug('renderTileCategoryIcon');
    let categoryIcon;

    switch (incident.category) {
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

    if (incident.category && this.showIcons && categoryIcon) {
      return html`<span class="category-icon" title="${this.category}"
        >${unsafeHTML(categoryIcon)}</span
      >`;
    }
    return html``;
  }

  renderSources(): TemplateResult {
    console.debug('renderSources');
    if (!this.sources.length) {
      return html``;
    }
    return html`
      <div class="time-machine-sources">Source: ${this.sources.join(', ')}</div>
    `;
  }

  private _incidentsTask: Task = new Task(this, {
    task: async ([country, category, emotion, impact, date, from, to]) => {
      console.debug('incidentsTask');
      this.fetchHistory(country, category, emotion, impact, date, from, to);
    },
    args: () => [
      this.country,
      this.category,
      this.emotion,
      this.impact,
      this.date,
      this.from,
      this.to,
    ],
  });

  async fetchHistory(
    country: string,
    category: string,
    emotion: string,
    impact: string,
    date: string,
    from: string,
    to: string
  ): Promise<void> {
    console.debug('fetchHistory');

    // Set defaults to explicit empty string.
    const countries = country || '';
    const categories = category || '';
    const emotions = emotion || '';
    const impacts = impact || '';
    const dateString = date || '';
    const fromString = from || '';
    const toString = to || '';

    if (this.loading) {
      // we are already loading
      return;
    }

    // setup all urls to fetch for incidents

    try {
      const urls: Array<URL> = [];

      const urlSearch = new URLSearchParams({
        country: countries,
        emotion: emotions,
        impact: impacts,
        limit: String(20),
      });

      if (dateString) {
        const date = new Date(dateString).toISOString().substring(0, 10);

        categories.split(',').forEach((category) => {
          // add category to search
          urlSearch.set('category', category);

          // setup url
          const url = new URL(`${this.teeeApiUrl}/${date}`);
          url.search = urlSearch.toString();

          urls.push(url);
        });
      } else if (fromString && toString) {
        const from = new Date(fromString).toISOString().substring(0, 10);
        const to = new Date(toString).toISOString().substring(0, 10);

        // add from and to date to search
        urlSearch.set('from', from);
        urlSearch.set('to', to);

        categories.split(',').forEach((category) => {
          // add category to search
          urlSearch.set('category', category);

          // setup url
          const url = new URL(this.teeeApiUrl);
          url.search = urlSearch.toString();

          urls.push(url);
        });
      } else {
        throw 'No correct date or period specified.';
      }

      // set the loading bit
      this.loading = true;

      // start fetching all incidents
      let incidents: Array<Incident> = [];
      await Util.asyncForeach(urls, async (url: string) => {
        const response = await fetch(url);
        const json = await response.json();
        incidents = incidents.concat(json.results);
      });

      // unset loading bit
      this.loading = false;

      // Shuffle incidents if shuffle is set
      if (this.shuffle) {
        incidents = Util.shuffleArray(incidents);
      }

      // search for sources on incidents
      const sourcesFoundInIncidents: IHash = {};
      incidents.forEach((incident: Incident) => {
        if (incident.source) {
          sourcesFoundInIncidents[incident.source] = true;
        }
      });
      this.sources = Object.keys(sourcesFoundInIncidents);

      // set the incidents, triggering an update
      this.incidents = incidents;
    } catch (e) {
      console.error('got an error while fetching history: ', e);
    }
  }

  _handleImageLoadError = (evt: Event) => {
    console.debug(`Error loading image: ${evt}`, evt);
    // grab the image element that triggered the error
    const targetImage = evt.target as HTMLImageElement;

    // find out which no image source needs to be used
    const noImageSrc = this.noImageSrc || NoImageImg;

    // don't try to set the image source if it
    // has already been set
    if (targetImage.src == noImageSrc) {
      return;
    }

    // report broken images back to the server if set
    if (this.reportBrokenImages) {
      Util.reportBrokenImage(this.teeeApiUrl, targetImage.src);
    }

    // wait a bit before setting the image
    // so we don't hammer the no image server
    setTimeout(() => {
      targetImage.src = noImageSrc;
    }, 250);

    return false;
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'time-machine': TimeMachine;
  }
}
