import { Util } from './Util';
import { Incident } from './Incident';
import { NoCoverImg, NewsIconOutlineSVG, RadioIconSVG, MovieIconOutlineSVG, NewsIconSVG, MusicIconSVG } from './Icon';

enum colors {
  background = 0,
  primary = 1,
  secondary = 2,
  tertiary = 3,
  quaternary = 4,
  quinary = 5,
}

interface IHash {
  [Identifier: string | number]: boolean | number | string | undefined
}

const template = document.createElement('template');
// https://www.webcomponents.org/element/@appnest/masonry-layout
template.innerHTML = `
<masonry-layout>
</masonry-layout>
`;

class TimeMachine extends HTMLElement {
  loading: boolean = false;
  palette: IHash = {};

  constructor() {
    super();
    this.injectFontsToMainDOM();
    this.derivePalette(this.getAttribute('colorPalette'));

    // Add a shadow DOM
    const shadowDOM = this.attachShadow({ mode: 'open' });
    // Render the template in the shadow dom
    shadowDOM.appendChild(template.content.cloneNode(true));
  }

  // Load external fonts
  // https://dev.to/akdevcraft/use-font-in-web-component-51a4
  injectFontsToMainDOM() {
    const font = document.createElement("link");
    font.href = "https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap";
    font.rel = "stylesheet"
    document.head.appendChild(font);
  }

  private derivePalette(colorPaletteJson: string): void {
    try {
      const colorPaletteArray = JSON.parse(colorPaletteJson);
      this.palette[colors.background] = colorPaletteArray[colors.background];
      this.palette[colors.primary] = colorPaletteArray[colors.primary];
      this.palette[colors.secondary] = colorPaletteArray[colors.secondary];
      this.palette[colors.tertiary] = colorPaletteArray[colors.tertiary];
      this.palette[colors.quaternary] = colorPaletteArray[colors.quaternary];
      this.palette[colors.quinary] = colorPaletteArray[colors.quinary];
    }
    catch (error) {
      console.error(`Could not parse color palette (${error})`);
      // Fallback to a default palette.
      this.palette[colors.background] = 'white';
      this.palette[colors.primary] = '#1f3b6c';
      this.palette[colors.secondary] = '#42c0d9';
      this.palette[colors.tertiary] = '#6accdf';
      this.palette[colors.quaternary] = '#92d8e5';
      this.palette[colors.quinary] = '#bae4eb';
    }
  }

  // Called when the element is added to the DOM
  connectedCallback() {
  }

  // any attribute specified in the following array will automatically
  // trigger attributeChangedCallback when you modify it.
  static get observedAttributes() {
    return ['date', 'country', 'from', 'to', 'colorPalette'];
  }

  removeAllChildren(parentElement: HTMLElement) {
    var childToDelete = parentElement.lastChild;
    while (childToDelete) {
      parentElement.removeChild(childToDelete);
      childToDelete = parentElement.lastChild;
    }
  }

  // Format dateString, fromString, toString: yyyy-mm-dd
  async fetchHistory(country: string, dateString: string, fromString: string, toString: string) {
    try {
      if (!country) {
        throw 'No country specified';
      }
      let urls = [];
      if (dateString) {
        const date = new Date(dateString).toISOString().substring(0, 10);
        urls.push(`https://public.api.v0.tee-e.com/${date}?country=${country}&category=newsItem&limit=50`);
        urls.push(`https://public.api.v0.tee-e.com/${date}?country=${country}&category=radioSong&limit=10`);
        urls.push(`https://public.api.v0.tee-e.com/${date}?country=${country}&category=cinemaMovie&limit=10`);
      }
      else if (fromString && toString) {
        const from = new Date(fromString).toISOString().substring(0, 10);
        const to = new Date(toString).toISOString().substring(0, 10);
        urls.push(`https://public.api.v0.tee-e.com/?from=${from}&to=${to}&country=${country}&category=newsItem&limit=50`);
        urls.push(`https://public.api.v0.tee-e.com/?from=${from}&to=${to}&country=${country}&category=radioSong&limit=10`);
        urls.push(`https://public.api.v0.tee-e.com/?from=${from}&to=${to}&country=${country}&category=cinemaMovie&limit=10`);
      }
      else {
        throw 'No correct date or period specified.';
      }
      this.loading = true;
      const sourcesFoundInIncidents: IHash = {};
      let incidents: Incident[] = [];
      await Util.asyncForeach(urls, async (url: string) => {
        const response = await fetch(url);
        const json = await response.json();
        incidents = incidents.concat(json.results);
      });
      // Shuffle incidents.
      // incidents = Util.shuffleArray(incidents);
      const masonry = this.shadowRoot.querySelector('masonry-layout');
      // Remove current set of slides.
      this.removeAllChildren(masonry as HTMLElement);
      masonry.setAttribute('style', `background-color: ${this.palette[colors.background]};`);

      // Add new set of slides.
      incidents.forEach((incident: Incident) => {
        const hasImage = incident?.image && incident?.image[0];
        const hasTitle = incident?.title;
        const hasText = incident?.text;
        if (incident.source) {
          sourcesFoundInIncidents[incident.source] = true;
        }
        const card = document.createElement('div');
        card.setAttribute('style', 'font-family: "Comfortaa", "Source Sans Pro", Helvetica, sans-serif; ');
        // const iconBox = document.createElement('div');
        // iconBox.setAttribute('style', `color: ${this.palette[colors.quaternary]}; width: 25px; position: relative; top: 65px; left: 15px; z-index: 1;`);
        // switch (incident.category) {
        //   case 'radioSong': iconBox.innerHTML = MusicIconSVG;
        //     break;
        //   case 'newsItem': iconBox.innerHTML = NewsIconOutlineSVG;
        //     break;
        //   case 'cinemaMovie': iconBox.innerHTML = MovieIconOutlineSVG;
        //     break;
        // }
        // card.appendChild(iconBox);

        if (incident?.title) {
          const titleBox = document.createElement('div');
          if (hasImage) {
            titleBox.setAttribute('style', `color: ${this.palette[colors.background]}; background-color: ${this.palette[colors.primary]}; position: relative; top: 50px; padding-top: 5px; text-align: center; font-weight: bold; line-height: 1.4em; overflow: hidden; width: 95%; margin: auto; border-radius: 3px; z-index: 1;`);
          }
          else {
            titleBox.setAttribute('style', `color: ${this.palette[colors.primary]}; position: relative; top: 5px; padding-top: 5px; text-align: center; font-weight: bold; line-height: 1.4em; overflow: hidden; z-index: 1;`);
          }
          titleBox.textContent = incident.title;
          card.appendChild(titleBox);
        }
        if (hasImage) {
          const imgBox = document.createElement('div');
          const img = document.createElement('img');
          img.setAttribute('src', incident.image[0]);
          img.setAttribute('onerror', `this.src='${this.getAttribute('noCover') ? this.getAttribute('noCover') : NoCoverImg}'`);
          img.setAttribute('style', 'width:100%');
          imgBox.appendChild(img);
          card.appendChild(imgBox);
        }
        if (incident?.text) {
          const textBox = document.createElement('div');
          if (hasImage) {
            textBox.setAttribute('style', `color: ${this.palette[colors.primary]}; position: relative; bottom: 78px; margin-bottom: -100px; text-align: justify; background-color: ${this.palette[colors.background]}; max-height: 62px; font-size: 0.75em; line-height: 1.2em; padding-top: 7px; padding-left: 7px; padding-right: 5px; overflow: scroll; width: 93%; margin: auto; border-radius: 3px;`);
          }
          else {
            textBox.setAttribute('style', `color: ${this.palette[colors.primary]}; text-align: justify; font-size: 0.75em; line-height: 1.4em; padding-top: 5px; padding-left: 5px; padding-right: 5px; overflow: scroll;`);
          }
          textBox.textContent = incident.text;
          card.appendChild(textBox);
        }
        const ruler = document.createElement('hr');
        ruler.setAttribute('style', 'width: 50%; border-top: 1px solid #f5eaea00; margin-bottom: -5px; margin-top: 15px;');
        card.appendChild(ruler);
        masonry.appendChild(card);
      });

      if (Object.keys(sourcesFoundInIncidents).length) {
        const sourcesBox = document.createElement('div');
        sourcesBox.setAttribute('style', `color: ${this.palette[colors.secondary]}; font-family: "Comfortaa", "Source Sans Pro", Helvetica, sans-serif; font-weight: normal; font-size: 0.7em;`);
        sourcesBox.textContent = `Source: ${Object.keys(sourcesFoundInIncidents).join(',')}`;
        masonry.appendChild(sourcesBox);
      }

      this.loading = false;
    }
    catch (error) {
      console.error(error);
    }
  }

  renderChanges() {
    this.fetchHistory(
      this.getAttribute('country'),
      this.getAttribute('date'),
      this.getAttribute('from'),
      this.getAttribute('to')
    );
  }

  // Mark: - Component lifecycle
  attributeChangedCallback() {
    this.renderChanges();
  }
}

export default TimeMachine;