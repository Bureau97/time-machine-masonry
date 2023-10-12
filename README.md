# Time Machine Widget

Use this widget to add historical context to your website. The internal name of an historic fact is `incident` and each incident is displayed in a `tile`. A tile consists of a title, an optional image and optional text block over the image.

## Usage
### Load
First load the javascript magic that defines our web component:
```
<script defer="defer" src="https://www.unpkg.com/time-machine-masonry@2.0.0"></script>
```

### Use
After this you can use a HTML element called 'time-machine' in your html page in which the incidents of a certain date (or date range) will be displayed. E.g.
```
<time-machine date="1993-03-03"></time-machine>
```

The time-machine element will use all the space it has been granted. To control this you can use css styling on the time-machine element itself or wrap it in a container that has controlled dimensions:
```
<div class="small-container">
    <time-machine class="small" date="1993-03-03" country="nl" category="newsItem"
        no-image-src="https://tee-e.com/images/pic01.jpg" show-icons></time-machine>
</div>
```
Please refer to index.html of this repo for a complete example.

### Control behaviour
The time-machine element accepts parameters to control it's behaviour:
* `date` : a specific *date* you want to retrieve incidents for. Format: `yyyy-mm-dd`
* `from` and `to` : a *period* you want to retrieve incidents for. Format: `yyyy-mm-dd`
* `country` : fetch incidents that where newsworhty in this country(ies). Reference https://swagger.tee-e.com for a list of supported countries.
* `category` : fetch incidents for this category(ies). Reference https://swagger.tee-e.com for a list of supported categories.
* `emotion` : fetch incidents that match this emotion(s). Reference https://swagger.tee-e.com for a list of supported emotions.
* `impact` : fetch incidents had this impact(s). Reference https://swagger.tee-e.com for a list of supported emotions.
* `shuffle` : shuffle the results before displaying
* `show-icons` : show the icons that correspond to the category
* `suppress-images` : do not show any images
* `no-image-src` : what image should be shown when an incident's image is broken. Use a url or base64 encoded image
* `report-broken-images` : report broken images back to the server so that they can be repaired

### Control styling

The time-machine element accepts css parameters to specify (significant parts of) it's styling:
* `--time-machine-title-color` : the text color of the title of the tile
* `--time-machine-title-background-color`: the background color of the title of the tile
* `--time-machine-title-font-size` : the font size of the title text of the tile
* `--time-machine-text-color` : the color of the content text of the tile
* `--time-machine-text-background-color` : the color of the background of the content of the tile
* `--time-machine-text-font-size` : the size of the title text of the tile
* `--time-machine-text-max-height` : the maximum height of the text of the tile
* `--time-machine-background-color` : the color of the background of the tile
* `--time-machine-image-min-height` : the minimum height of the image
* `--time-machine-ruler-color` : the color of the ruler that is displayed between two incidents vertically
* `--time-machine-icon-color` : the color of the incident's category icon



## Development
Fetch all packages: `npm ci`  
Run the application: `npm run demo`  
Navigate to http://localhost:8000  