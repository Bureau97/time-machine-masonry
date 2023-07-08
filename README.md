# Time Machine Widget

Use this widget to add historical context to your website.

## Usage
First load the javascript magic that defines our web component:
```
<script defer="defer" src="https://www.unpkg.com/time-machine-masonry@1.0.3"></script>
```

Then add the custom element 'time-machine' to your html. And pass parameters to specify a specific context.
### Window
If you are interested in a specific date, then pass the date via parameter 'date'. E.g. March 3rd 1993:
```
<time-machine date="1993-03-03"></time-machine>
```
If you are interested in a specific period, then pass that period via parameters `from` and `to`. E.g. the year 2010:
```
<time-machine from="2010-01-01" to="2010-12-31"></time-machine>
```

### Perspective
Historical events are perceived from a certain perspective. Therefore we offer data per country. Currently we support these countries: `nl`, `fr`, `de`.
Specify the perspective you are interested in via parameter `country`. E.g. the year 2010 in a Dutch perspective:
```
<time-machine from="2010-01-01" to="2010-12-31" country="nl"></time-machine>
```

### Coloring
You can customize the widget by specifying a color palette. This palette should be passed via parameter `colorPalette` and should contain a list of colors in JSON format. The position in that list defines how the color should be used.
```
colorPalette='[<background>, <primary>, <secondary>, <tertiary>, <quaternary>, <quinary>]'
```
E.g.
```
colorPalette='["#f9f9f9", "#e57b13", "#ec940e", "#f3ae0a", "#f3ae0a", "#fbc806"]'
```

### 404 robustness
Urls to images may be broken, to circumvent broken images you can specify an base64 encoded image that should be displayed via parameter `noImage`. E.g.
```
    noImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wQMDCEDZE8l3wAAAAxpVFh0Q29tbWVudAAAAAAAvK6ymQAAABVJREFUOMtjYBgFo2AUjIJRMAooAQAGSgABkOHaHwAAAABJRU5ErkJggg=="
```

A complete example:
```
<!doctype html>
<html>
    <head>
        <style>
            body {
                font-family: serif, sans-serif;
            }

            h1 {
                text-align: center;
            }

            .small-container {
                margin: auto;
                width: 300px;
                height: 500px;
                overflow: scroll;
            }

            .big-container {
                margin: auto;
                font-weight: bold;
                text-align: center;
            }
        </style>
        <script defer="defer" src="https://www.unpkg.com/time-machine-masonry@1.0.3"></script>
    </head>
    <body>
        <h1>1993</h1>
        <!-- One specific date in a narrow container. No custom coloring. -->
        <div class="small-container">
            <time-machine date="1993-03-03" country="nl"></time-machine>
        </div>

        <h1>2010</h1>
        <!-- A period in a wide container. With custom coloring and a custom 'noImage' image. -->
        <div class="big-container">
            <time-machine from="2010-01-01" to="2010-12-31" country="nl" colorPalette='["#f9f9f9", "#e57b13", "#ec940e", "#f3ae0a", "#f3ae0a", "#fbc806"]' noImage="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAKCAYAAADGmhxQAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5wQMDCEDZE8l3wAAAAxpVFh0Q29tbWVudAAAAAAAvK6ymQAAABVJREFUOMtjYBgFo2AUjIJRMAooAQAGSgABkOHaHwAAAABJRU5ErkJggg=="></time-machine>
        </div>
    </body>
</html>
```