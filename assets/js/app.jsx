var map;
require([
    "esri/map", "esri/dijit/Search", "donnors/maps/Utils", "esri/geometry/webMercatorUtils",
    "react", "react-dom", "react-bootstrap",
    "dojo/domReady!"
], function (Map, Search, Utils, webMercatorUtils, React, ReactDOM, ReactBootstrap) {
    map = new Map("map", {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: "streets"
    });

    var search = new Search({
        map: map
    }, "search");

    map.on("load", function () {
        var utils = new Utils({
            map: map
        });

        function orientationChanged() {
            map.reposition();
            map.resize();
        }

        search.startup();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition (
                function (location) {
                    utils.zoomToLocation(location.coords.longitude, location.coords.latitude);
                },
                function(error) {
                    utils.locationError(error)
                }
            );

            utils.watchId = navigator.geolocation.watchPosition(
                function (location) {
                    utils.showLocation(location.coords.longitude, location.coords.latitude)
                },
                function(error) {
                    utils.locationError(error)
                }
            );

        } else {
            console.error("Geolocation Not Supported");
        }

        map.on("click", function (evt) {
            debugger;
            var position = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
            utils.updateLocation(position.x, position.y);
            var Modal = ReactBootstrap.Modal;
            var Button = ReactBootstrap.Button;

            var mountNode = document.getElementById('donnor-dialog');

            const modalInstance = (
                <div className="static-modal">
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Modal title</Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            One fine body...
                        </Modal.Body>

                        <Modal.Footer>
                            <Button>Close</Button>
                            <Button bsStyle="primary">Save changes</Button>
                        </Modal.Footer>

                    </Modal.Dialog>
                </div>
            );
            ReactDOM.render(modalInstance, mountNode);




        });
    });





});