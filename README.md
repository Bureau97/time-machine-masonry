# Time Machine Widget

Use this widget to add events and facts of a period or specific date to your website.

First load the javascript magic that defines the web component:
```
<script defer="defer" src="main.js"></script>
```

Then specify what period or date you are interested in.  
E.g. March 3rd 1993:
```
<time-machine date="1993-03-03" country="nl"></time-machine>
```
Or the year 2010:
```
<time-machine from="2010-01-01" to="2010-12-31" country="nl"></time-machine>
```


A complete example:
```
<!doctype html>
<html>
    <head>
        <title>Time Machine Demo</title>
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
        <script defer="defer" src="main.js"></script>
    </head>
    <body>
        <h1>1993</h1>
        <div class="small-container">
            <time-machine date="1993-03-03" country="nl"></time-machine>
        </div>
        <h1>2010</h1>
        <div class="big-container">
            <time-machine from="2010-01-01" to="2010-12-31" country="nl"></time-machine>
        </div>
    </body>
</html>
```