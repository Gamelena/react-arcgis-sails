var self;
define(["dojo/_base/declare", "esri/geometry/Point", "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color"
], function (declare, Point, Graphic,
    SimpleMarkerSymbol, SimpleLineSymbol, Color) {
    return declare("donnors.maps.Utils", null, {
        map: null,

        graphic: null,

        constructor: function (args) {
            dojo.mixin(this, args);
        },

        checkLocation: function () {
            self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(self.zoomToLocation, self.locationError);
                watchId = navigator.geolocation.watchPosition(self.showLocation, self.locationError);
            } else {
                console.error("Geolocation Not Supported");
            }
        },

        locationError: function (error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    console.error("Location not provided");
                    break;
                case error.POSITION_UNAVAILABLE:
                    console.error("Current location not available");
                    break;
                case error.TIMEOUT:
                    console.error("Timeout");
                    break;
                default:
                    alert("unknown error");
                    break;
            }
        },

        zoomToLocation: function (location) {
            var pt = new Point(location.coords.longitude, location.coords.latitude);
            self.addGraphic(pt);
            self.map.centerAndZoom(pt, 15);
        },

        showLocation: function (location) {
            //zoom to the users location and add a graphic
            var pt = new Point(location.coords.longitude, location.coords.latitude);
            if (!graphic) {
                self.addGraphic(pt);
            } else { // move the graphic if it already exists
                self.graphic.setGeometry(pt);
            }
            self.map.centerAt(pt);
        },

        addGraphic: function (pt) {
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
            self.graphic = new Graphic(pt, symbol);
            self.map.graphics.add(graphic);
        }
    });
});