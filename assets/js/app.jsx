var map;
require([
    "esri/map", "esri/dijit/Search", "donors/maps/Utils", "esri/geometry/webMercatorUtils",
    "react", "react-dom", "react-bootstrap",  "dojo/json", "dojo/on", "dojo/store/JsonRest",
    "dojo/domReady!"
], function (Map, Search, Utils, webMercatorUtils, React, ReactDOM, ReactBootstrap, json, on, JsonRest) {

    map = new Map("map", {
        center: [-56.049, 38.485],
        zoom: 3,
        basemap: "streets"
    });

    var search = new Search({
        map: map
    }, "search");

    var store = new JsonRest({
        target: "/donors"
    });

    var layers = [];

    var showingDonor = false;

    var loadMarkers = function (map) {
        store.query().then(function(results){
            for (var i in layers) {
                layers[i].remove();
            }

            for (var i in results) {
                var point = new esri.geometry.Point(results[i].coord_x, results[i].coord_y);
                point = esri.geometry.geographicToWebMercator(point);
                var symbol = new esri.symbol.PictureMarkerSymbol("https://cdn1.iconfinder.com/data/icons/Map-Markers-Icons-Demo-PNG/128/Map-Marker-Marker-Outside-Chartreuse.png", 32, 32);
                var graphic = new esri.Graphic(point, symbol);


                var layer = new esri.layers.GraphicsLayer();
                layer.data = results[i];
                on (layer, "click", function (evt) {
                    var mountNode = document.getElementById('donor-dialog');
                    const ModalInstance = reactModalPrivateDataDonor(this.data);


                    ReactDOM.render(<ModalInstance/>, mountNode);
                    $('#donor-dialog').show();
                    showingDonor = true;
                });

                layer.add(graphic);
                layers.push(layer);
                map.addLayer(layer);
            }
        });
    }


    io.socket.on('donors-change', function() {
        debugger;
        loadMarkers(map);
    });

    map.on("load", function () {
        loadMarkers(this);


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


        //listen changes on iframe of process
        var iframe = document.getElementById('ifrmprocess');
        if (iframe.attachEvent) {//IE
            iframe.attachEvent('onload', function() {listenIframe(iframe)});
        } else {
            var listener = on(iframe, 'load', function() {listenIframe(iframe)});
        }

        function listenIframe(iframe)
        {
            var Alert = ReactBootstrap.Alert;

            const myAlert = (
                <Alert bsStyle="danger">
                    <h4>{message}</h4>
                </Alert>
            );

            var rawResponse = getIframeResponse(iframe);
            var response = json.parse(rawResponse);

            if (response.first_name) {

                var mountNode = document.getElementById('donor-dialog');

                $('#donor-dialog').hide();


                const ModalInstance = reactModalDataDonor(response);


                ReactDOM.render(<ModalInstance/>, mountNode);
                $('#donor-dialog').show();

            } else {
                if (response.status === 400 && response.message.match("already exists")) {
                    var message = 'This Email is already registered.';
                } else {
                    var message = response.message;
                }
                const myAlert = (
                    <Alert bsStyle="danger">
                        <h4>{message}</h4>
                    </Alert>
                );
                ReactDOM.render(myAlert, document.getElementById('warnings'));
            }
        }

        map.on("click", function (evt) {
            if (!showingDonor) {
                var position = webMercatorUtils.webMercatorToGeographic(evt.mapPoint);
                var mountNode = document.getElementById('donor-dialog');

                utils.updateLocation(position.x, position.y);

                var Modal = ReactBootstrap.Modal;
                var Button = ReactBootstrap.Button;


                const FormInstance = reactFormDonor({
                    coord_x: position.x,
                    coord_y: position.y
                });

                const modalInstance = (
                    <div className="static-modal">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>I wanna be donor</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <FormInstance />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={function(){$('#donor-dialog').hide()}}>Close</Button>
                                <Button onClick={submitDonor} bsStyle="primary">Save</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                );

                function submitDonor(e) {
                    if (!$('#form-donor').valid()) {
                        return false;
                    } else {
                        $('#form-donor').submit();
                        loadMarkers(map);
                    }
                }

                ReactDOM.render(modalInstance, mountNode);
                $('#donor-dialog').show();
            }
        });
    });

    //Cross browser implementation for read iframe body response
    var getIframeResponse = function(iframe) {
        if (iframe.contentDocument.body.innerText)  {
            //chrome ie
            var rawResponse = iframe.contentDocument.body.innerText;
        } else if (iframe.contentDocument.getElementsByTagName('pre')[0]) {
            //firefox
            var rawResponse = iframe.contentDocument.getElementsByTagName('pre')[0].innerHTML;
        } else if (iframe.contentDocument.getElementsByTagName('body')[0]) {
            //firefox sometimes
            var rawResponse = iframe.contentDocument.getElementsByTagName('body')[0].innerHTML;
        }
        return rawResponse;
    }

    //React Directives

    var reactFormDonor = function (data) {
        var FormGroup = ReactBootstrap.FormGroup;
        var FormControl = ReactBootstrap.FormControl;
        var ControlLabel = ReactBootstrap.ControlLabel;

        return React.createClass({
            handleChange: function(event) {
                this.setState({value: event.target.value});
            },
            render() {
                return (
                    <form id="form-donor" method="post" action="/donors" target="ifrmprocess">
                        <FormGroup controlId="formFirstName">
                            <ControlLabel>First Name</ControlLabel>
                            <FormControl type="text" name="first_name" defaultValue={(data.first_name) ? data.first_name : ''} placeholder="Enter first name" required onChange={this.handleChange}  />
                        </FormGroup>
                        <FormGroup controlId="formLastName">
                            <ControlLabel>Last Name</ControlLabel>
                            <FormControl type="text" name="last_name" defaultValue={(data.last_name) ? data.last_name : ''} placeholder="Enter last name" required onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup controlId="formContactNumber">
                            <ControlLabel>Contact Number</ControlLabel>
                            <FormControl type="tel" name="contact_number" defaultValue={(data.contact_number) ? data.contact_number : ''} placeholder="Enter phone" required onChange={this.handleChange} />
                        </FormGroup>
                        <FormGroup controlId="formEmail">
                            <ControlLabel>Email address</ControlLabel>
                            <FormControl type="email" name="email" defaultValue={(data.email) ? data.email : ''} placeholder="Enter email" required onChange={this.handleChange} />
                        </FormGroup>

                        <FormGroup controlId="formBloodGroup">
                            <ControlLabel>Blood Group</ControlLabel>
                            <FormControl componentClass="select" name="blood_group" defaultValue={(data.blood_group) ? data.blood_group : ''} onChange={this.handleChange} placeholder="select blood group"  data-dojo-type="dijit/form/FilteringSelect" required>
                                <option value="">select blood group</option>
                                <option value="O-">O-</option>
                                <option value="O+">O+</option>
                                <option value="B-">B-</option>
                                <option value="B+">B+</option>
                                <option value="A-">A-</option>
                                <option value="A+">A+</option>
                                <option value="AB-">AB-</option>
                                <option value="AB+">AB+</option>
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId="formControlsEmail">
                            <ControlLabel>Address</ControlLabel>
                            <FormControl type="text" name="address" placeholder="Enter address" defaultValue={(data.address) ? data.address : ''} onChange={this.handleChange}  required />
                        </FormGroup>
                        <FormControl type="hidden" name="coord_x" value={(data.coord_x) ? data.coord_x : ''}/>
                        <FormControl type="hidden" name="coord_y" value={(data.coord_y) ? data.coord_y : ''} />
                        <div id="warnings"></div>
                    </form>

                );
            }
        });
    }

    var reactTableDonor = function(response) {
        var Modal = ReactBootstrap.Modal;
        var FormGroup = ReactBootstrap.FormGroup;
        var FormControl = ReactBootstrap.FormControl;
        var ControlLabel = ReactBootstrap.ControlLabel;

        return React.createClass({
            render() {
                return (
                    <div className="static-modal">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Your contact information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered condensed hover>
                                    <tbody>
                                    <tr>
                                        <th>First Name</th>
                                        <td>{response.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td>{response.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact Number</th>
                                        <td>{response.contact_number}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{response.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{response.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Blood Group</th>
                                        <td>{response.blood_group}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={doneAdd} bsStyle="success">Done</Button>
                                <Button onClick={function(){modifyDonor(response.id)}} bsStyle="primary">Modify</Button>
                                <Button onClick={function(){deleteDonor(response.id)}} bsStyle="danger">Delete</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>

                );
            }
        });
    }

    var doneAdd = function()
    {
        $('#donor-dialog').hide();
        alert('Thank you!');
        loadMarkers(map);
    }

    var reactModalDataDonor = function(response) {
        var Modal = ReactBootstrap.Modal;
        var Table = ReactBootstrap.Table;
        var Button = ReactBootstrap.Button;

        return React.createClass({
            render() {
                return (
                    <div className="static-modal">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Your contact information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered condensed hover>
                                    <tbody>
                                    <tr>
                                        <th>First Name</th>
                                        <td>{response.first_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td>{response.last_name}</td>
                                    </tr>
                                    <tr>
                                        <th>Contact Number</th>
                                        <td>{response.contact_number}</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td>{response.email}</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td>{response.address}</td>
                                    </tr>
                                    <tr>
                                        <th>Blood Group</th>
                                        <td>{response.blood_group}</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={function(){$('#donor-dialog').hide(); alert('Thank you!')}}
                                        bsStyle="success">Done</Button>
                                <Button onClick={function(){modifyDonor(response.id)}} bsStyle="primary">Modify</Button>
                                <Button onClick={function(){deleteDonor(response.id)}} bsStyle="danger">Delete</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                )
            }
        });
    }

    var reactModalPrivateDataDonor = function(response) {
        var Modal = ReactBootstrap.Modal;
        var Table = ReactBootstrap.Table;
        var Button = ReactBootstrap.Button;

        return React.createClass({
            handleClick: function(evt) {
                var td = evt.currentTarget;
                td.innerHTML = response[td.dataset.field];
            },
            render() {
                return (
                    <div className="static-modal">
                        <Modal.Dialog>
                            <Modal.Header>
                                <Modal.Title>Donor</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Table striped bordered condensed hover>
                                    <tbody>
                                    <tr>
                                        <th>First Name</th>
                                        <td onClick={this.handleClick} data-field="first_name">&lt;Click to Show&gt;</td>
                                    </tr>
                                    <tr>
                                        <th>Last Name</th>
                                        <td onClick={this.handleClick} data-field="last_name">&lt;Click to Show&gt;</td>
                                    </tr>
                                    <tr>
                                        <th>Contact Number</th>
                                        <td onClick={this.handleClick} data-field="contact_number">&lt;Click to Show&gt;</td>
                                    </tr>
                                    <tr>
                                        <th>Email</th>
                                        <td onClick={this.handleClick} data-field="email">&lt;Click to Show&gt;</td>
                                    </tr>
                                    <tr>
                                        <th>Address</th>
                                        <td onClick={this.handleClick} data-field="address">&lt;Click to Show&gt;</td>
                                    </tr>
                                    <tr>
                                        <th>Blood Group</th>
                                        <td onClick={this.handleClick} data-field="blood_group">&lt;Click to Show&gt;</td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={function(){$('#donor-dialog').hide(); showingDonor = false}}
                                        bsStyle="success">Close</Button>
                            </Modal.Footer>
                        </Modal.Dialog>
                    </div>
                )
            }
        });
    }


    var modifyDonor = function(id) {
        store.get(id).then(function(item){
            var Modal = ReactBootstrap.Modal;
            var Button = ReactBootstrap.Button;

            var mountNode = document.getElementById('donor-dialog');
            const FormInstance = reactFormDonor(item);
            const modalInstance = (
                <div className="static-modal">
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Modify Data</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <FormInstance />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={function(){$('#donor-dialog').hide()}}>Close</Button>
                            <Button onClick={function() { updateDonor(item.id)} } bsStyle="primary">Save</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </div>
            );
            ReactDOM.render(modalInstance, mountNode);
            $('#donor-dialog').show();
        });



    }

    var updateDonor = function(id)
    {

        if (!$('#form-donor').valid()) {
            return false;
        } else {
            document.getElementById('form-donor').action = '/donors/' + id;
            $('#form-donor').submit();
            document.getElementById('form-donor').action = '/donors/';
        }
    }

    var deleteDonor = function(id) {
        if (confirm('Delete donor?')) {
            store.remove(id);
            alert('Deleted');
            $('#donor-dialog').hide();
            loadMarkers(map);
            socket.emit('donors-change', id);

        }
    }

});
