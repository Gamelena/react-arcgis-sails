define(["dojo/_base/declare", "esri/geometry/Point", "esri/graphic", "esri/geometry/Point",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"
], function (declare, Point, Graphic, Point,
    SimpleMarkerSymbol, SimpleLineSymbol, Color) {

    return declare("donors.maps.Utils", null, {
        map: null,

        graphic: null,

        zoom : 15,

        watchId : null,

        constructor: function (args) {
            dojo.mixin(this, args);
        },

        addGraphic: function (point) {
            var symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                12,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([210, 105, 30, 0.5]),
                    8
                ),
                new Color([210, 105, 30, 0.9])
            );
            this.graphic = new Graphic(point, symbol);
            this.map.graphics.add(this.graphic);
        },

        locationError: function(error){
            if (navigator.geolocation) {
                navigator.geolocation.clearWatch(this.watchId);
            }

            switch (error.code){
                case error.PERMISSION_DENIED: console.error("Location not provided");
                    break;
                case error.POSITION_UNAVAILABLE:  console.error("Current location not available");
                    break;
                case error.TIMEOUT:  console.error("Timeout");
                    break;
                default: alert("unknown error");
                    break;
            }
        },

        zoomToLocation: function(longitude, latitude) {
            var point = new Point(longitude, latitude);
            this.addGraphic(point);
            this.map.centerAndZoom(point, this.zoom);
        },

        showLocation: function (longitude, latitude) {
            //zoom to the users location and add a graphic
            var point = new Point(longitude, latitude);
            if ( !this.graphic ) {
                this.addGraphic(point);
            } else { // move the graphic if it already exists
                this.graphic.setGeometry(point);
            }
            this.map.centerAt(point);
        },

        updateLocation: function(longitude, latitude) {
            this.showLocation(longitude, latitude);
            var point = new Point(longitude, latitude);
            this.map.centerAndZoom(point, this.zoom);

        }
    });
});